import { IsInt, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateManpowerDto {
  @ApiProperty({
    description: 'ID of the company providing manpower',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  companyId: string;

  @ApiProperty({ description: 'Number of workers', example: 12 })
  @IsInt()
  @Min(1)
  headcount: number;

  @ApiProperty({ description: 'Total hours worked', example: 8.5 })
  @IsNumber()
  @Min(0)
  hours: number;

  @ApiPropertyOptional({
    description: 'Additional notes',
    example: 'Framing crew on level 2',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
