import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsBoolean,
  MaxLength,
} from 'class-validator';

export class CreateContactDto {
  @ApiProperty({ description: 'First name', example: 'John' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  firstName: string;

  @ApiProperty({ description: 'Last name', example: 'Smith' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  lastName: string;

  @ApiPropertyOptional({ description: 'Job title', example: 'Project Manager' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  title?: string;

  @ApiPropertyOptional({
    description: 'Contact email',
    example: 'john.smith@acme.com',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    description: 'Contact phone number',
    example: '+1-555-987-6543',
  })
  @IsString()
  @IsOptional()
  @MaxLength(30)
  phone?: string;

  @ApiPropertyOptional({
    description: 'Whether this is the primary contact for the company',
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isPrimary?: boolean;
}
