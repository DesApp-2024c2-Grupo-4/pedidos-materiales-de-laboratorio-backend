import { IsEnum, IsOptional, IsString } from 'class-validator';
import { RequestStatus, RequestStatuses } from '../request/request.const';

export class StatusDto {
  @IsOptional()
  @IsString()
  @IsEnum(RequestStatuses, { each: true })
  status?: RequestStatus;
}
