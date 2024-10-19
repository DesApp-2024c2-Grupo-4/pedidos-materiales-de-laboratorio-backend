import { PartialType } from '@nestjs/mapped-types';
import { Request } from '../schemas/request.schema';

export class UpdateRequestDto extends PartialType(Request) {}
