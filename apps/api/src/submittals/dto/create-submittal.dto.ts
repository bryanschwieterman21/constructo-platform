import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsDateString,
  IsInt,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSubmittalDto {
  @ApiProperty({ description: 'Title of the submittal' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ description: 'Description of the submittal' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Specification section reference' })
  @IsOptional()
  @IsString()
  specSection?: string;

  @ApiPropertyOptional({ description: 'ID of the user assigned to review the submittal' })
  @IsOptional()
  @IsUUID()
  assigneeId?: string;

  @ApiPropertyOptional({ description: 'Due date for the submittal' })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiPropertyOptional({ description: 'Lead time in days for procuring the material' })
  @IsOptional()
  @IsInt()
  @Min(0)
  leadTimeDays?: number;
}
