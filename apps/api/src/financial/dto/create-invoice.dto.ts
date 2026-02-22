import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateInvoiceDto {
  @ApiProperty({ description: 'Invoice number' })
  @IsString()
  @IsNotEmpty()
  invoiceNumber: string;

  @ApiProperty({ description: 'Invoice amount', type: Number })
  @IsNumber()
  amount: number;

  @ApiPropertyOptional({ description: 'Billing period start date' })
  @IsDateString()
  @IsOptional()
  periodStart?: string;

  @ApiPropertyOptional({ description: 'Billing period end date' })
  @IsDateString()
  @IsOptional()
  periodEnd?: string;

  @ApiPropertyOptional({ description: 'Payment due date' })
  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @ApiPropertyOptional({ description: 'Additional notes' })
  @IsString()
  @IsOptional()
  notes?: string;
}
