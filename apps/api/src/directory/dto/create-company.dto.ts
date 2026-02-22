import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({ description: 'Company name', example: 'Acme Construction LLC' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({
    description: 'Trade type / specialty',
    example: 'Electrical',
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  tradeType?: string;

  @ApiPropertyOptional({ description: 'Street address' })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  address?: string;

  @ApiPropertyOptional({ description: 'City' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  city?: string;

  @ApiPropertyOptional({ description: 'State' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  state?: string;

  @ApiPropertyOptional({ description: 'ZIP code' })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  zip?: string;

  @ApiPropertyOptional({ description: 'Phone number', example: '+1-555-123-4567' })
  @IsString()
  @IsOptional()
  @MaxLength(30)
  phone?: string;

  @ApiPropertyOptional({ description: 'Email address', example: 'info@acme.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    description: 'Company website',
    example: 'https://acme-construction.com',
  })
  @IsUrl()
  @IsOptional()
  website?: string;

  @ApiPropertyOptional({ description: 'License number' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  licenseNumber?: string;

  @ApiPropertyOptional({ description: 'Additional notes' })
  @IsString()
  @IsOptional()
  notes?: string;
}
