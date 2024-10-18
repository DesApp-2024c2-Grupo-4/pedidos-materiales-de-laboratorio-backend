import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleDbService } from './role-db.service';
import { Role, RoleSchema } from 'src/schemas/role.schema';
import  {RoleController} from 'src/roles/role.controller'
import { RoleService } from './role.service';



@Module({
  imports: [MongooseModule.forFeature([
    { name: Role.name, schema: RoleSchema },
  ])],
  providers: [RoleDbService,RoleService],
  controllers: [RoleController]
})
export class RoleModule { }
