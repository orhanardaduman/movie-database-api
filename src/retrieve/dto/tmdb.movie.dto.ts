import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO representing a movie from The Movie Database (TMDB) API
 * Contains validation rules and Swagger documentation for the movie data
 */
export class TmdbMovieDto {
  /**
   * The unique identifier from TMDB
   * Must be a non-empty number
   */
  @ApiProperty({
    description: 'TMDB ID of the movie',
    example: 123,
  })
  @IsNotEmpty()
  id: number;

  /**
   * The original title of the movie as provided by TMDB
   * Must be a non-empty string
   */
  @ApiProperty({
    description: 'Original title of the movie',
    example: 'The Shawshank Redemption',
  })
  @IsNotEmpty()
  @IsString()
  original_title: string;

  /**
   * A text description/summary of the movie's plot
   * Must be a non-empty string
   */
  @ApiProperty({
    description: 'Overview/plot summary of the movie',
    example: 'Two imprisoned men bond over a number of years...',
  })
  @IsNotEmpty()
  @IsString()
  overview: string;

  /**
   * A numeric score indicating the movie's popularity on TMDB
   * Must be a non-empty number
   */
  @ApiProperty({
    description: 'Popularity score of the movie',
    example: 82.953,
  })
  @IsNotEmpty()
  popularity: number;

  /**
   * The average rating given by TMDB users
   * Must be a non-empty number between 0-10
   */
  @ApiProperty({
    description: 'Average vote rating out of 10',
    example: 8.7,
  })
  @IsNotEmpty()
  vote_average: number;

  /**
   * Total number of user votes/ratings on TMDB
   * Must be a non-empty number
   */
  @ApiProperty({
    description: 'Total number of votes received',
    example: 24000,
  })
  @IsNotEmpty()
  vote_count: number;

  /**
   * The movie's release date in YYYY-MM-DD format
   * Must be a non-empty string
   */
  @ApiProperty({
    description: 'Release date of the movie',
    example: '1994-09-23',
  })
  @IsNotEmpty()
  @IsString()
  release_date: string;

  /**
   * Array of genre objects containing id and name
   * Must be a non-empty array
   */
  @ApiProperty({
    description: 'Genres of the movie',
    example: [
      { id: 18, name: 'Drama' },
      { id: 80, name: 'Crime' },
    ],
  })
  @IsNotEmpty()
  genres: { id: number; name: string }[];
}
