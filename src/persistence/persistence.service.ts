import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreatePersistenceDto } from './dto/create-persistence.dto';
import { UpdatePersistenceDto } from './dto/update-persistence.dto';
import { Movies } from '../entities/movie.entitie';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

/**
 * Service handling persistence operations for movies in the database.
 * Provides CRUD operations with error handling and data validation.
 */
@Injectable()
export class PersistenceService {
  /**
   * Initializes the persistence service with the movie model.
   * @param movieModel - Mongoose model for the Movies collection
   */
  constructor(@InjectModel(Movies.name) private movieModel: Model<Movies>) {}

  /**
   * Persists a new movie in the database.
   * @param createPersistenceDto - Movie data transfer object containing movie details
   * @returns Promise resolving to the newly created movie document
   * @throws InternalServerErrorException if database operation fails
   */
  async save(createPersistenceDto: CreatePersistenceDto) {
    try {
      // Create new movie document by spreading the DTO properties
      // and generating a new UUID for the id field
      // This ensures each movie has a unique identifier
      return await this.movieModel.create({
        ...createPersistenceDto,
        id: crypto.randomUUID(), // Generate unique UUID for new movie
      });
    } catch (error) {
      // If database operation fails, wrap the error in a NestJS exception
      // This provides consistent error handling across the application
      throw new InternalServerErrorException(
        `Failed to create movie: ${error.message}`,
      );
    }
  }

  /**
   * Retrieves all movies stored in the database.
   * @returns Promise resolving to array of movie documents
   * @throws InternalServerErrorException if database query fails
   */
  async findAll() {
    try {
      // Query the database to retrieve all movie documents
      return await this.movieModel.find();
    } catch (error) {
      // If database query fails, wrap the error in a NestJS exception
      throw new InternalServerErrorException(
        `Failed to find movies: ${error.message}`,
      );
    }
  }

  /**
   * Retrieves a specific movie by its unique identifier.
   * @param id - Unique identifier of the movie to find
   * @returns Promise resolving to the found movie document
   * @throws NotFoundException if movie does not exist
   * @throws InternalServerErrorException if database query fails
   */
  async findById(id: string) {
    try {
      // Query database for movie with matching id
      // Using findOne since id should be unique
      const movie = await this.movieModel.findOne({ id });

      // If no movie found with given id, throw 404 error
      // This provides clear feedback that the resource doesn't exist
      if (!movie) {
        throw new NotFoundException(`Movie with id ${id} not found`);
      }

      // Return the found movie document
      // Document contains all movie fields from schema
      return movie;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      // Wrap any database errors in a 500 Internal Server Error
      // This maintains consistent error handling across the app
      throw new InternalServerErrorException(
        `Failed to find movie: ${error.message}`,
      );
    }
  }

  /**
   * Updates an existing movie's information.
   * @param id - Unique identifier of the movie to update
   * @param updatePersistenceDto - Data transfer object containing updated movie details
   * @returns Promise resolving to the updated movie document
   * @throws NotFoundException if movie does not exist
   * @throws InternalServerErrorException if database operation fails
   */
  async updateById(id: string, updatePersistenceDto: UpdatePersistenceDto) {
    try {
      // First check if movie exists in database
      const movie = await this.movieModel.findOne({ id });

      // Throw 404 error if movie not found
      // This provides clear feedback that the resource doesn't exist
      if (!movie) {
        throw new NotFoundException(`Movie with id ${id} not found`);
      }

      // Update the movie document with new data
      const updatedMovie = await this.movieModel.findOneAndUpdate(
        { id },
        updatePersistenceDto,
        { new: true },
      );
      return updatedMovie;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      // Wrap any database errors in a 500 Internal Server Error
      // This maintains consistent error handling across the app
      throw new InternalServerErrorException(
        `Failed to update movie: ${error.message}`,
      );
    }
  }

  /**
   * Deletes a movie from the database.
   * @param id - Unique identifier of the movie to delete
   * @returns Promise resolving to the deleted movie document
   * @throws NotFoundException if movie does not exist
   * @throws InternalServerErrorException if database operation fails
   */
  async removeById(id: string) {
    // First check if movie exists in database
    const movie = await this.movieModel.findOne({ id });

    // Throw 404 error if movie not found
    // This provides clear feedback that the resource doesn't exist
    if (!movie) {
      throw new NotFoundException(`Movie with id ${id} not found`);
    }

    try {
      // Delete the movie document and return the deleted document
      // Using findOneAndDelete to get back the document that was removed
      return await this.movieModel.findOneAndDelete({ id });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      // Wrap any database errors in a 500 Internal Server Error
      // This maintains consistent error handling across the app
      throw new InternalServerErrorException(
        `Failed to delete movie: ${error.message}`,
      );
    }
  }
}
