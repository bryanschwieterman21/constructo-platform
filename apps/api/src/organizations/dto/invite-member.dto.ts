import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { OrgRole } from '@prisma/client';

export class InviteMemberDto {
  @ApiProperty({ description: 'Email address of the user to invite', example: 'newmember@example.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Role to assign within the organization',
    enum: OrgRole,
    example: 'MEMBER',
  })
  @IsNotEmpty()
  @IsEnum(OrgRole)
  role: OrgRole;
}
