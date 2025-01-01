import { Controller, Get } from '@nestjs/common';
import { RetrieveService } from './retrieve.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

/**
 * Controller responsible for retrieving and updating movie data from external sources
 * Provides endpoints for synchronizing the local database with external movie data
 */
@Controller('retrieve')
@ApiTags('Retrieve')
export class RetrieveController {
  /**
   * Creates an instance of RetrieveController
   * @param RetrieveService - The service handling movie data retrieval operations
   */
  constructor(private readonly RetrieveService: RetrieveService) {}

  /**
   * Updates the local database with latest movie data from external sources
   * @returns Promise containing the result of the database update operation
   */
  @Get()
  @ApiOperation({
    summary:
      'Update the local database with latest movie data from external sources',
  })
  @ApiResponse({
    status: 200,
    description: 'Database updated successfully',
  })
  @ApiResponse({
    status: 500,
    description: 'Failed to update database',
  })
  updateDatabase() {
    return this.RetrieveService.updateDatabase();
  }
}
