import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

/* Providers */
import MongooseProvider from './config/mongoose.provider';
import { AuthGuardProvider } from './auth/providers/auth-guard.provider';
import  { EquipmentModule } from './equipment/equipment.module';
import { EquipmentController } from './equipment/equipment.controller';

/* App Modules */
import { AuthModule } from './auth/auth.module';
import { ConversationModule } from './conversation/conversation.module';
import { MaterialModule } from './material/material.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync(MongooseProvider),
    AuthModule,
    EquipmentModule,
    ConversationModule,
    MaterialModule,
  ],
  controllers: [],
  providers: [AuthGuardProvider],
})
export class AppModule {}
