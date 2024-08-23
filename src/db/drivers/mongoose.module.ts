import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import MongooseDriver from './mongoose.driver';

@Module({
  controllers: [MongooseDriver],
  providers: [ConfigModule],
})


export class DatabaseModule {}