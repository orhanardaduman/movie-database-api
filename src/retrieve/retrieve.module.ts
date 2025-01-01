import { Module } from '@nestjs/common';
import { RetrieveService } from './retrieve.service';
import { RetrieveController } from './retrieve.controller';
import { ExternalRequest } from 'src/helpers/external.request';
import { MongooseModule } from '@nestjs/mongoose';
import { Movies } from 'src/entities/movie.entitie';
import { MoviesSchema } from 'src/entities/movie.entitie';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Movies.name, schema: MoviesSchema }]),
  ],
  controllers: [RetrieveController],
  providers: [RetrieveService, ExternalRequest],
})
export class RetrieveModule {}
