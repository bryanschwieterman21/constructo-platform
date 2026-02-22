import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class CreateOrgDto {
  @ApiProperty({ description: 'Organization name', example: 'Acme Construction LLC' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  name: string;

  @ApiPropertyOptional({ description: 'Street address', example: '123 Builder Ave' })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  address?: string;

  @ApiPropertyOptional({ description: 'City', example: 'Austin' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;

  @ApiPropertyOptional({ description: 'State', example: 'TX' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  state?: string;

  @ApiPropertyOptional({ description: 'ZIP / Postal code', example: '78701' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  zip?: string;

  @ApiPropertyOptional({ description: 'Phone number', example: '+1-555-987-6543' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @ApiPropertyOptional({ description: 'Website URL', example: 'https://acme-construction.com' })
  @IsOptional()
  @IsString()
  @IsUrl({}, { message: 'website must be a valid URL' })
  @MaxLength(300)
  website?: string;
}
