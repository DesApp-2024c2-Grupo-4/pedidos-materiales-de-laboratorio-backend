import { PartialType } from '@nestjs/mapped-types';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UserLoginDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNumber()
  dni: string;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  matricula: number;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
