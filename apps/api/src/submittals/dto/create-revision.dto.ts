import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRevisionDto {
  @ApiPropertyOptional({ description: 'Notes for this revision' })
  @IsOptional()
  @IsString()
  notes?: string;
}
