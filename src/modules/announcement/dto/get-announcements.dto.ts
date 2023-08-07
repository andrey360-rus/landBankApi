import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt } from "class-validator";

export class GetAnnouncementsDto {
  @ApiProperty({ default: 1 })
  @ApiPropertyOptional()
  @IsInt()
  page?: number;

  @ApiProperty({ default: 100 })
  @ApiPropertyOptional()
  @IsInt()
  limit?: number;

  @ApiProperty({ default: 100000000 })
  @ApiPropertyOptional()
  price_to?: number;

  @ApiProperty({ default: 1 })
  @ApiPropertyOptional()
  price_from?: number;

  @ApiProperty({ default: 10000000 })
  @ApiPropertyOptional()
  area_to?: number;

  @ApiProperty({ default: 1 })
  @ApiPropertyOptional()
  area_from?: number;

  @ApiProperty()
  @ApiPropertyOptional()
  domain?: string;

  @ApiProperty()
  @ApiPropertyOptional()
  address?: string;
}
