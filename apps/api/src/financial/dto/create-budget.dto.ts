import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBudgetDto {
  @ApiProperty({ description: 'Budget name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Budget description' })
  @IsString()
  @IsOptional()
  description?: string;
}
