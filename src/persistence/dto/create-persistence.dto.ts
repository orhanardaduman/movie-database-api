import { IsNotEmpty, IsString, IsNumber, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for creating a new movie in the database.
 * Contains validation rules and Swagger documentation for the movie data.
 */
export class CreatePersistenceDto {
  /**
   * The unique identifier from The Movie Database (TMDB)
   * Must be a non-empty number
   */
  @ApiProperty({
    description: 'TMDB ID of the movie',
    example: 123,
  })
  @IsNotEmpty()
  @IsNumber()
  tmdb_id: number;

  /**
   * The title/name of the movie
   * Must be a non-empty string
   */
  @ApiProperty({
    description: 'Name of the movie',
    example: 'The Shawshank Redemption',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  /**
   * A text description/summary of the movie's plot
   * Must be a non-empty string
   */
  @ApiProperty({
    description: 'Overview of the movie',
    example: 'Two imprisoned men bond over a number of years...',
  })
  @IsNotEmpty()
  @IsString()
  overview: string;

  /**
   * A numeric score indicating the movie's popularity
   * Must be a non-empty number
   */
  @ApiProperty({
    description: 'Movie popularity score',
    example: 82.953,
  })
  @IsNotEmpty()
  @IsNumber()
  popularity: number;

  /**
   * The average rating given by users
   * Must be a non-empty number between 0-10
   */
  @ApiProperty({
    description: 'Average vote rating',
    example: 8.7,
  })
  @IsNotEmpty()
  @IsNumber()
  voteAverage: number;

  /**
   * Total number of user votes/ratings
   * Must be a non-empty number
   */
  @ApiProperty({
    description: 'Number of votes',
    example: 24000,
  })
  @IsNotEmpty()
  @IsNumber()
  voteCount: number;

  /**
   * The date when the movie was released
   * Must be a non-empty string in YYYY-MM-DD format
   */
  @ApiProperty({
    description: 'Release date',
    example: '1994-09-23',
  })
  @IsNotEmpty()
  @IsString()
  releaseDate: string;

  /**
   * Array of genre objects containing id and name
   * Must be a non-empty array of objects with numeric id and string name
   */
  @ApiProperty({
    description: 'Movie genres',
    example: [
      { id: 18, name: 'Drama' },
      { id: 80, name: 'Crime' },
    ],
  })
  @IsNotEmpty()
  @IsArray()
  genres: { id: number; name: string }[];
}
