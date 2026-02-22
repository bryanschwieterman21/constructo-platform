import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateFolderDto {
  @ApiProperty({ description: 'Folder name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Parent folder ID for nested folders' })
  @IsUUID()
  @IsOptional()
  parentId?: string;
}
