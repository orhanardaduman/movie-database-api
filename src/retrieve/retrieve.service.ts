import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ExternalRequest } from '../helpers/external.request';
import { InjectModel } from '@nestjs/mongoose';
import { MoviesDocument, Movies } from '../entities/movie.entitie';
import { Model } from 'mongoose';
import { TmdbMovieDto } from './dto/tmdb.movie.dto';

/**
 * Service responsible for retrieving movie data from The Movie Database (TMDB) API
 * and synchronizing it with the local database. Handles fetching, validation and storage
 * of movie information.
 */
@Injectable()
export class RetrieveService {
  constructor(
    private externalRequest: ExternalRequest,
    @InjectModel(Movies.name) private movieModel: Model<MoviesDocument>,
  ) {}

  /**
   * Default HTTP request options for TMDB API calls including authorization token
   * Sets accept header to JSON and includes the API access token
   */
  options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.TMDB_API_ACCESS_TOKEN}`,
    },
  };

  /**
   * Type guard that validates if a movie object contains all required fields
   * @param requiredFields - Array of field names that must exist on the movie object
   * @param movie - Movie object from TMDB API to validate
   * @returns Boolean indicating if movie has all required fields, with type narrowing
   */
  isValidMovie(
    requiredFields: string[],
    movie: TmdbMovieDto,
  ): movie is TmdbMovieDto {
    // Check that every required field exists in the movie object
    // Returns true only if ALL fields are defined (not undefined)
    // This ensures the movie data contains all necessary information
    return requiredFields.every((field) => {
      return movie[field] !== undefined;
    });
  }

  /**
   * Fetches detailed movie information from TMDB API by movie ID
   * @param id - TMDB movie ID to lookup
   * @returns Promise resolving to detailed movie information including genres
   * @throws BadRequestException if response is missing required genre information
   */
  async getMovieDetails(id: number) {
    // Make API request to get detailed movie information from TMDB
    const details = await this.externalRequest.get<TmdbMovieDto>(
      `${process.env.TMDB_API_URL}/movie/${id}`,
      '', // No query parameters needed for movie details endpoint
      this.options,
    );

    // Define required fields that must exist in the movie details response
    const requiredFieldsForDetails = ['genres'];
    if (!details) {
      throw new BadRequestException('Movie details not found');
    }
    // Validate that the response contains the required genre information
    if (!this.isValidMovie(requiredFieldsForDetails, details)) {
      throw new BadRequestException(
        'Response contains movies with missing required fields',
      );
    }

    // Return the validated movie details
    return details;
  }

  /**
   * Retrieves a filtered list of movies from TMDB API
   * Applies filters for:
   * - Highly rated movies (vote average >= 8.4)
   * - Well reviewed movies (vote count >= 1500)
   * - Available on Netflix in Turkey
   * - Sorted by release date ascending
   * @returns Promise resolving to array of filtered movies
   * @throws BadRequestException if response format is invalid or movies are missing required fields
   */
  async getMovies() {
    // Build query parameters for TMDB API request
    // Filters for high quality movies available on Netflix Turkey
    const queryParams = new URLSearchParams({
      sort_by: 'primary_release_date.asc', // Sort by release date ascending
      'vote_count.gte': '1500', // Must have at least 1500 votes
      'vote_average.gte': '8.4', // Must have rating >= 8.4
      with_watch_providers: '8', // Filter for Netflix (provider ID 8)
      watch_region: 'TR', // Filter for Turkey region
      page: '1', // Get first page of results
    });

    // Make API request to TMDB discover endpoint
    const response = await this.externalRequest.get<TmdbMovieDto[]>(
      `${process.env.TMDB_API_URL}/discover/movie?`,
      queryParams.toString(),
      this.options,
    );

    // Validate response is an array
    if (!response || !Array.isArray(response)) {
      throw new BadRequestException('Invalid response format from TMDB API');
    }

    // Define required fields that must exist on each movie object
    const requiredFields = [
      'original_title', // Original movie title
      'overview', // Movie plot summary
      'popularity', // Popularity score
      'vote_average', // Average rating
      'vote_count', // Number of votes
      'release_date', // Release date
    ];

    // Validate all movies have required fields
    if (!response.every((movie) => this.isValidMovie(requiredFields, movie))) {
      throw new BadRequestException(
        'Response contains movies with missing required fields',
      );
    }

    return response;
  }

  /**
   * Synchronizes the local database with latest movie data from TMDB API
   * Process:
   * 1. Fetches filtered list of top rated movies from TMDB API
   * 2. For each movie, gets additional details including genres
   * 3. Creates standardized movie models with UUIDs
   * 4. Checks for existing movies in database by TMDB ID
   * 5. Inserts only new movies that don't already exist
   * @returns Object containing success message and count of newly added movies
   * @throws InternalServerErrorException if database operations fail
   */
  async updateDatabase() {
    try {
      // Get filtered list of movies from TMDB API
      const filteredMovies = await this.getMovies();
      const models: Movies[] = [];

      // Fetch additional details for each movie in parallel and create standardized models
      await Promise.all(
        filteredMovies.map(async (movie) => {
          // Get genre and other details for the movie
          const details = await this.getMovieDetails(movie.id);

          // Create standardized movie model with UUID
          models.push({
            tmdb_id: movie.id,
            id: crypto.randomUUID(),
            name: movie.original_title,
            overview: movie.overview,
            popularity: movie.popularity,
            voteAverage: movie.vote_average,
            voteCount: movie.vote_count,
            releaseDate: movie.release_date,
            genres: details.genres,
          });
        }),
      );

      // Find existing movies in database by TMDB IDs
      const existingMovies = await this.movieModel.find({
        tmdb_id: { $in: models.map((m) => m.tmdb_id) },
      });

      // Extract TMDB IDs of existing movies
      const existingTmdbIds = existingMovies.map((m) => m.tmdb_id);

      // Filter out movies that already exist in database
      const newMovies = models.filter(
        (m) => !existingTmdbIds.includes(m.tmdb_id),
      );

      // Insert new movies if any found
      if (newMovies.length > 0) {
        await this.movieModel.insertMany(newMovies);
      }

      // Return success response with count of newly added movies
      return {
        message: 'Database updated successfully',
        updatedCount: newMovies.length,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      // Handle any errors during the update process
      throw new InternalServerErrorException(
        `Failed to update database: ${error.message}`,
      );
    }
  }
}
