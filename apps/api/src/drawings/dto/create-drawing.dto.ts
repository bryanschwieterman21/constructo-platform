import { IsEnum, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum DrawingDiscipline {
  ARCHITECTURAL = 'ARCHITECTURAL',
  STRUCTURAL = 'STRUCTURAL',
  MECHANICAL = 'MECHANICAL',
  ELECTRICAL = 'ELECTRICAL',
  PLUMBING = 'PLUMBING',
  CIVIL = 'CIVIL',
  LANDSCAPE = 'LANDSCAPE',
  FIRE_PROTECTION = 'FIRE_PROTECTION',
  GENERAL = 'GENERAL',
}

export class CreateDrawingDto {
  @ApiProperty({
    description: 'Drawing number',
    example: 'A-101',
  })
  @IsString()
  @MinLength(1)
  number: string;

  @ApiProperty({
    description: 'Drawing title',
    example: 'First Floor Plan',
  })
  @IsString()
  @MinLength(1)
  title: string;

  @ApiProperty({
    description: 'Drawing discipline',
    enum: DrawingDiscipline,
    example: DrawingDiscipline.ARCHITECTURAL,
  })
  @IsEnum(DrawingDiscipline)
  discipline: DrawingDiscipline;
}
