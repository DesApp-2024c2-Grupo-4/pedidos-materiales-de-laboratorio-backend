import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class IsAvailableDto {
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value.toLowerCase() === 'true')
  isAvailable?: boolean;
}
