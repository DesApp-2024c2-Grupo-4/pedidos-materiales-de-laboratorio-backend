import { PartialType } from '@nestjs/mapped-types';
import { Reactive } from '../schemas/requestable/reactive.schema';

export class UpdateReactivelDto extends PartialType(Reactive) {}
