import { PartialType } from '@nestjs/swagger';
import { CreatePersistenceDto } from './create-persistence.dto';

/**
 * DTO for updating a movie in the database
 * Extends the CreatePersistenceDto to allow partial updates
 */
export class UpdatePersistenceDto extends PartialType(CreatePersistenceDto) {}
