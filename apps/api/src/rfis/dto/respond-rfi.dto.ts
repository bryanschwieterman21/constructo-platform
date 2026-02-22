import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RespondRfiDto {
  @ApiProperty({ description: 'Response body text for the RFI' })
  @IsString()
  @IsNotEmpty()
  body: string;
}
