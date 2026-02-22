import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateChangeOrderDto {
  @ApiProperty({ description: 'Change order title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ description: 'Change order description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Change order amount', type: Number })
  @IsNumber()
  amount: number;

  @ApiPropertyOptional({ description: 'Associated contract ID' })
  @IsUUID()
  @IsOptional()
  contractId?: string;

  @ApiPropertyOptional({ description: 'Due date for the change order' })
  @IsDateString()
  @IsOptional()
  dueDate?: string;
}
