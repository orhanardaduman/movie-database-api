import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PersistenceService } from './persistence.service';
import { CreatePersistenceDto } from './dto/create-persistence.dto';
import { UpdatePersistenceDto } from './dto/update-persistence.dto';
import { ApiResponse, ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { Movies } from '../entities/movie.entitie';

/**
 * Controller handling CRUD operations for movie persistence in the database.
 * Provides endpoints for creating, reading, updating and deleting movie records.
 */
@Controller('persistence')
@ApiTags('Persistence')
export class PersistenceController {
  constructor(private readonly persistenceService: PersistenceService) {}

  /**
   * Persists a new movie record in the database
   * @param createPersistenceDto - DTO containing the movie data to be saved
   * @returns Promise resolving to the newly created movie document
   */
  @Post()
  @ApiOperation({ summary: 'Save a new movie to the database' })
  @ApiBody({ type: CreatePersistenceDto })
  @ApiResponse({
    status: 201,
    description: 'Movie saved successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid movie data',
  })
  @ApiResponse({
    status: 500,
    description: 'Failed to save movie',
  })
  save(@Body() createPersistenceDto: CreatePersistenceDto) {
    return this.persistenceService.save(createPersistenceDto);
  }

  /**
   * Fetches all movie records from the database
   * @returns Promise resolving to an array of all stored movie documents
   */
  @Get()
  @ApiOperation({ summary: 'Fetch all movies from the database' })
  @ApiResponse({
    status: 200,
    description: 'Fetched all movies successfully',
  })
  @ApiResponse({
    status: 500,
    description: 'Failed to fetch movies',
  })
  findAll(): Promise<Movies[]> {
    return this.persistenceService.findAll();
  }

  /**
   * Retrieves a single movie record by its unique identifier
   * @param id - Unique identifier of the movie to retrieve
   * @returns Promise resolving to the requested movie document
   */
  @Get(':id')
  @ApiOperation({ summary: 'Fetch a movie by its unique identifier' })
  @ApiResponse({
    status: 200,
    description: 'Fetched movie successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Movie not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Failed to fetch movie',
  })
  findById(@Param('id') id: string): Promise<Movies> {
    return this.persistenceService.findById(id);
  }

  /**
   * Updates an existing movie record in the database
   * @param id - Unique identifier of the movie to update
   * @param updatePersistenceDto - DTO containing the updated movie data
   * @returns Promise resolving to the updated movie document
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing movie in the database' })
  @ApiBody({ type: UpdatePersistenceDto })
  @ApiResponse({
    status: 200,
    description: 'Movie updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Movie not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Failed to update movie',
  })
  updateById(
    @Param('id') id: string,
    @Body() updatePersistenceDto: UpdatePersistenceDto,
  ): Promise<Movies> {
    return this.persistenceService.updateById(id, updatePersistenceDto);
  }

  /**
   * Deletes a movie record from the database
   * @param id - Unique identifier of the movie to delete
   * @returns Promise resolving to the deleted movie document
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a movie from the database' })
  @ApiResponse({
    status: 200,
    description: 'Movie deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Movie not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Failed to delete movie',
  })
  removeById(@Param('id') id: string): Promise<Movies> {
    return this.persistenceService.removeById(id);
  }
}
