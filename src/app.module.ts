import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PersistenceModule } from './persistence/persistence.module';
import { RetrieveModule } from './retrieve/retrieve.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    RetrieveModule,
    PersistenceModule,
  ],
})
export class AppModule {}
