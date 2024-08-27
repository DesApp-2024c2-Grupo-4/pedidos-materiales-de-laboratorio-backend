import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import MongooseProvider from './db/mongoose.provider';

@Module({
  imports: [MongooseModule.forRootAsync(MongooseProvider)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
