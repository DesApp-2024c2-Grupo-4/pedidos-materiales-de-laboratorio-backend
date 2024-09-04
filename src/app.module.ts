import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

/* Providers */
import MongooseProvider from './config/mongoose.provider';
import { AuthGuardProvider } from './auth/providers/auth-guard.provider';

/* App Modules */
import { AuthModule } from './auth/auth.module';
import { ConversationModule } from './conversation/conversation.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync(MongooseProvider),
    AuthModule,
    ConversationModule,
  ],
  controllers: [],
  providers: [AuthGuardProvider],
})
export class AppModule {}
