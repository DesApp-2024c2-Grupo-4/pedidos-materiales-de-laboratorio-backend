import { Prop, Schema } from '@nestjs/mongoose';
import { IsBoolean, IsOptional } from 'class-validator';

@Schema()
export class SoftDelete {
  @IsOptional()
  @IsBoolean()
  @Prop({ type: Boolean })
  isSoftDeleted?: boolean;
}

export const IS_SOFT_DELETED_KEY = 'isSoftDeleted';
