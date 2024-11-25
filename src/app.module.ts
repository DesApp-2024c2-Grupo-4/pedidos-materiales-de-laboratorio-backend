import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

/* Providers */
import MongooseProvider from './config/mongoose.provider';
import { AuthGuardProvider } from './auth/providers/auth-guard.provider';
import { EquipmentModule } from './equipment/equipment.module';

/* App Modules */
import { AuthModule } from './auth/auth.module';
import { ConversationModule } from './conversation/conversation.module';
import { MaterialModule } from './material/material.module';
import { ReactiveModule } from './reactive/reactive.module';
import { UserInitModule } from './user/user-init/user-init.module';
import { RequestModule } from './request/request.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync(MongooseProvider),
    UserInitModule,
    AuthModule,
    EquipmentModule,
    ConversationModule,
    MaterialModule,
    ReactiveModule,
    RequestModule,
    UserModule,
  ],
  controllers: [],
  providers: [AuthGuardProvider],
})
export class AppModule {}
