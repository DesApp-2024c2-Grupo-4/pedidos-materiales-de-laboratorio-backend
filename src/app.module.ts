import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import MongooseProvider from './db/mongoose.provider';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync(MongooseProvider),
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
