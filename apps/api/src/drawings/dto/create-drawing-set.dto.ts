import { IsDateString, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDrawingSetDto {
  @ApiProperty({
    description: 'Name of the drawing set',
    example: 'Architectural - Issue for Construction',
  })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiPropertyOptional({
    description: 'Description of the drawing set',
    example: 'Full architectural set for Phase 1',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Issue date of the drawing set',
    example: '2026-02-21',
  })
  @IsOptional()
  @IsDateString()
  issueDate?: string;
}
