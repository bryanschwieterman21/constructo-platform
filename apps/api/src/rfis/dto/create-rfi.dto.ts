import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsEnum,
  IsBoolean,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum RfiPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export class CreateRfiDto {
  @ApiProperty({ description: 'Subject of the RFI' })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({ description: 'Question being asked in the RFI' })
  @IsString()
  @IsNotEmpty()
  question: string;

  @ApiPropertyOptional({ description: 'ID of the user assigned to answer the RFI' })
  @IsOptional()
  @IsUUID()
  assigneeId?: string;

  @ApiPropertyOptional({ description: 'Priority level of the RFI', enum: RfiPriority })
  @IsOptional()
  @IsEnum(RfiPriority)
  priority?: RfiPriority;

  @ApiPropertyOptional({ description: 'Due date for the RFI response' })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiPropertyOptional({ description: 'Whether the RFI has a cost impact' })
  @IsOptional()
  @IsBoolean()
  costImpact?: boolean;

  @ApiPropertyOptional({ description: 'Whether the RFI has a schedule impact' })
  @IsOptional()
  @IsBoolean()
  scheduleImpact?: boolean;
}
