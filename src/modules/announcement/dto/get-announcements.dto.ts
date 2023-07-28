import { ApiProperty } from "@nestjs/swagger";
import { IsInt } from "class-validator";

class UnitsDiapason {
  @ApiProperty({ required: false, default: 100000000 })
  to: number;

  @ApiProperty({ required: false, default: 1 })
  from: number;
}

export class GetAnnouncementsDto {
  @ApiProperty({ required: false, default: 15 })
  @IsInt()
  page?: number;

  @ApiProperty({ required: false, default: 20 })
  @IsInt()
  limit?: number;

  // @ApiProperty({required: false})
  // area?: UnitsDiapason;

  // @ApiProperty({required: false})
  // price?: UnitsDiapason;

  @ApiProperty({ required: false, default: 100000000 })
  price_to?: number;

  @ApiProperty({ required: false, default: 1 })
  price_from?: number;

  @ApiProperty({ required: false, default: 10000000 })
  area_to?: number;

  @ApiProperty({ required: false, default: 1 })
  area_from?: number;

  @ApiProperty({ required: false })
  domain?: string;

  @ApiProperty({ required: false })
  address?: string;
}
