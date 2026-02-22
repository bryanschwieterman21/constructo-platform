import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  MaxLength,
} from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ description: 'Project name', example: 'Downtown Office Tower' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({ description: 'Unique project code', example: 'PRJ-2026-001' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  code: string;

  @ApiPropertyOptional({ description: 'Project description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Street address' })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  address?: string;

  @ApiPropertyOptional({ description: 'City' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  city?: string;

  @ApiPropertyOptional({ description: 'State' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  state?: string;

  @ApiPropertyOptional({ description: 'ZIP code' })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  zip?: string;

  @ApiPropertyOptional({ description: 'Project start date', example: '2026-03-01' })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({ description: 'Project end date', example: '2027-06-30' })
  @IsDateString()
  @IsOptional()
  endDate?: string;
}
