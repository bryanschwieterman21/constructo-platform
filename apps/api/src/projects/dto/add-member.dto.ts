import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsOptional, IsUUID } from 'class-validator';

export enum ProjectRole {
  OWNER = 'OWNER',
  MANAGER = 'MANAGER',
  SUPERINTENDENT = 'SUPERINTENDENT',
  ENGINEER = 'ENGINEER',
  SUBCONTRACTOR = 'SUBCONTRACTOR',
  VIEWER = 'VIEWER',
}

export class AddMemberDto {
  @ApiProperty({ description: 'User ID to add as project member' })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'Role of the member in the project',
    enum: ProjectRole,
    example: ProjectRole.MANAGER,
  })
  @IsEnum(ProjectRole)
  @IsNotEmpty()
  role: ProjectRole;

  @ApiPropertyOptional({ description: 'Associated company ID' })
  @IsUUID()
  @IsOptional()
  companyId?: string;
}
