import { IsInt, IsOptional, IsString, IsUrl, Min, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRevisionDto {
  @ApiProperty({
    description: 'Revision identifier (e.g. "A", "B", "1", "2")',
    example: 'A',
  })
  @IsString()
  @MinLength(1)
  revision: string;

  @ApiProperty({
    description: 'URL to the revision file',
    example: 'https://storage.example.com/drawings/a-101-rev-a.pdf',
  })
  @IsString()
  @IsUrl()
  fileUrl: string;

  @ApiProperty({
    description: 'Name of the uploaded file',
    example: 'A-101-Rev-A.pdf',
  })
  @IsString()
  @MinLength(1)
  fileName: string;

  @ApiProperty({
    description: 'File size in bytes',
    example: 2048576,
  })
  @IsInt()
  @Min(1)
  fileSize: number;

  @ApiPropertyOptional({
    description: 'Notes about this revision',
    example: 'Updated per RFI-042 response',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
