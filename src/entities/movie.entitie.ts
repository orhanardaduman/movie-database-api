import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Type definition for Movies document with Mongoose Document capabilities
 */
export type MoviesDocument = Movies & Document;

/**
 * Schema definition for Movies collection
 */
@Schema()
export class Movies {
  /**
   * Unique identifier for the movie
   */
  @ApiProperty({
    description: 'UUID of the movie',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Prop({ required: true, unique: true })
  id: string;

  /**
   * The Movie Database (TMDB) unique identifier
   */
  @ApiProperty({
    description: 'TMDB ID of the movie',
    example: 123,
  })
  @Prop({ required: true, unique: true })
  tmdb_id: number;

  /**
   * Original title of the movie
   */
  @ApiProperty({
    description: 'Name of the movie',
    example: 'The Shawshank Redemption',
  })
  @Prop({ required: true })
  name: string;

  /**
   * Plot summary or description of the movie
   */
  @ApiProperty({
    description: 'Overview of the movie',
    example: 'Two imprisoned men bond over a number of years...',
  })
  @Prop({ required: true })
  overview: string;

  /**
   * Popularity score from TMDB
   */
  @ApiProperty({
    description: 'Movie popularity score',
    example: 82.953,
  })
  @Prop({ required: true })
  popularity: number;

  /**
   * Average user rating from TMDB
   */
  @ApiProperty({
    description: 'Average vote rating',
    example: 8.7,
  })
  @Prop({ required: true })
  voteAverage: number;

  /**
   * Total number of user ratings
   */
  @ApiProperty({
    description: 'Number of votes',
    example: 24000,
  })
  @Prop({ required: true })
  voteCount: number;

  /**
   * Initial theatrical release date
   */
  @ApiProperty({
    description: 'Release date',
    example: '1994-09-23',
  })
  @Prop({ required: true })
  releaseDate: string;

  /**
   * List of genres associated with the movie
   */
  @ApiProperty({
    description: 'Movie genres',
    example: [
      { id: 18, name: 'Drama' },
      { id: 80, name: 'Crime' },
    ],
  })
  @Prop({ type: [{ id: Number, name: String }] })
  genres: { id: number; name: string }[];
}

/**
 * Mongoose schema generated from the Movies class
 */
export const MoviesSchema = SchemaFactory.createForClass(Movies);
