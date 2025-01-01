import { Module } from '@nestjs/common';
import { PersistenceService } from './persistence.service';
import { PersistenceController } from './persistence.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Movies, MoviesSchema } from '../entities/movie.entitie';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Movies.name, schema: MoviesSchema }]),
  ],
  controllers: [PersistenceController],
  providers: [PersistenceService],
})
export class PersistenceModule {}
