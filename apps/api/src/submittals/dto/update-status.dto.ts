import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum SubmittalStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  APPROVED_AS_NOTED = 'APPROVED_AS_NOTED',
  REVISE_AND_RESUBMIT = 'REVISE_AND_RESUBMIT',
  REJECTED = 'REJECTED',
  CLOSED = 'CLOSED',
}

export class UpdateStatusDto {
  @ApiProperty({
    description: 'New status for the submittal',
    enum: SubmittalStatus,
  })
  @IsNotEmpty()
  @IsEnum(SubmittalStatus)
  status: SubmittalStatus;
}
