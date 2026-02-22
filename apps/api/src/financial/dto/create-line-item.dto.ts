import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateLineItemDto {
  @ApiProperty({ description: 'Cost code for the line item' })
  @IsString()
  @IsNotEmpty()
  costCode: string;

  @ApiPropertyOptional({ description: 'Description of the line item' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Original budgeted amount', type: Number })
  @IsNumber()
  originalAmount: number;
}
