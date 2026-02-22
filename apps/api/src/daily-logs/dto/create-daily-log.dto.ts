import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum WeatherCondition {
  SUNNY = 'SUNNY',
  PARTLY_CLOUDY = 'PARTLY_CLOUDY',
  CLOUDY = 'CLOUDY',
  RAINY = 'RAINY',
  STORMY = 'STORMY',
  SNOWY = 'SNOWY',
  WINDY = 'WINDY',
  FOGGY = 'FOGGY',
}

export class CreateDailyLogDto {
  @ApiProperty({ description: 'Date of the daily log', example: '2026-02-21' })
  @IsDateString()
  date: string;

  @ApiProperty({
    description: 'Weather condition',
    enum: WeatherCondition,
    example: WeatherCondition.SUNNY,
  })
  @IsEnum(WeatherCondition)
  weather: WeatherCondition;

  @ApiPropertyOptional({ description: 'High temperature (F)', example: 85 })
  @IsOptional()
  @IsNumber()
  tempHigh?: number;

  @ApiPropertyOptional({ description: 'Low temperature (F)', example: 62 })
  @IsOptional()
  @IsNumber()
  tempLow?: number;

  @ApiPropertyOptional({ description: 'Wind speed (mph)', example: 12 })
  @IsOptional()
  @IsNumber()
  windSpeed?: number;

  @ApiPropertyOptional({
    description: 'Precipitation amount (inches)',
    example: 0.25,
  })
  @IsOptional()
  @IsNumber()
  precipitation?: number;

  @ApiPropertyOptional({
    description: 'Additional notes',
    example: 'Concrete pour completed on level 3',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
