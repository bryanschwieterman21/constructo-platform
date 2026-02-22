import { PartialType } from '@nestjs/swagger';
import { CreateRfiDto } from './create-rfi.dto';

export class UpdateRfiDto extends PartialType(CreateRfiDto) {}
