import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
} from 'class-validator';

export class CreateDocumentDto {
  @ApiProperty({ description: 'Original file name' })
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @ApiProperty({ description: 'URL of the uploaded file (from client-side S3 upload)' })
  @IsUrl()
  @IsNotEmpty()
  fileUrl: string;

  @ApiProperty({ description: 'File size in bytes', type: Number })
  @IsNumber()
  fileSize: number;

  @ApiProperty({ description: 'MIME type of the file' })
  @IsString()
  @IsNotEmpty()
  mimeType: string;

  @ApiPropertyOptional({ description: 'Document description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Folder ID to place the document in' })
  @IsUUID()
  @IsOptional()
  folderId?: string;
}
