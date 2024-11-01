import { PickType } from '@nestjs/mapped-types';
import { RegisterToken } from '../schemas/register-token.schema';

export class CreateRegisterTokenDto extends PickType(RegisterToken, [
  'createdFor',
]) {}
