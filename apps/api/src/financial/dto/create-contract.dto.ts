import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export enum ContractType {
  PRIME = 'PRIME',
  SUBCONTRACT = 'SUBCONTRACT',
  PURCHASE_ORDER = 'PURCHASE_ORDER',
  PROFESSIONAL_SERVICE = 'PROFESSIONAL_SERVICE',
}

export class CreateContractDto {
  @ApiProperty({ description: 'Contract title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ description: 'Contract number' })
  @IsString()
  @IsOptional()
  contractNumber?: string;

  @ApiProperty({ description: 'Type of contract', enum: ContractType })
  @IsEnum(ContractType)
  type: ContractType;

  @ApiProperty({ description: 'Contract amount', type: Number })
  @IsNumber()
  amount: number;

  @ApiPropertyOptional({ description: 'Associated company ID' })
  @IsUUID()
  @IsOptional()
  companyId?: string;

  @ApiPropertyOptional({ description: 'Contract start date' })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({ description: 'Contract end date' })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiPropertyOptional({ description: 'Contract description' })
  @IsString()
  @IsOptional()
  description?: string;
}
