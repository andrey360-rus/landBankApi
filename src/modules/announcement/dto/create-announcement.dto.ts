import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsNumber, IsString } from "class-validator";
import { IsNull } from "typeorm";

export class CreateAnnouncementDto {
  @ApiProperty({
    example: "1",
    description: "Уникальный идентификатор объявления",
  })
  @IsNumber({}, { message: "Должно быть числом" })
  id: number;

  @ApiProperty({
    example: "Участок 20 соток",
    description: "Заголовок объявления",
  })
  @IsString({ message: "Должно быть строкой" })
  title: string;

  @ApiProperty({
    example:
      "Продам земельный участок 825кв.м. Отличный участок с фундаментом. Подходит под ИЖС.",
    description: "Описание объявления",
  })
  @IsString({ message: "Должно быть строкой" })
  description: string;

  @ApiProperty({
    example: "10000",
    description: "Площадь объекта в кв.м",
  })
  @IsNumber({}, { message: "Должно быть числом" })
  area: number;

  @ApiProperty({
    example:
      "Ставропольский край, Шпаковский муниципальный округ, Орловка садовое товарищество",
    description: "Адрес объекта",
  })
  @IsString({ message: "Должно быть строкой" })
  address: string;

  @ApiProperty({
    example: "1000000",
    description: "Цена объекта в рублях",
  })
  @IsNumber({}, { message: "Должно быть числом" })
  price: number;

  @ApiProperty({
    type: "array",
    items: {
      type: "string",
      example:
        "https://cdn-p.cian.site/images/0/380/269/uchastok-laptevo-96208088-1.jpg",
    },
    description: "Фотографии объекта",
    nullable: true,
  })
  @ApiPropertyOptional()
  @IsArray()
  @IsString({ each: true })
  photos: string[];

  @ApiProperty({
    example: "agricultural",
    description: "Категория объекта",
    nullable: true,
  })
  @ApiPropertyOptional()
  @IsString({ message: "Должно быть строкой" })
  land_category: string;

  @ApiProperty({
    example: "izhs",
    description: "Вид объекта",
  })
  @ApiPropertyOptional()
  @IsString({ message: "Должно быть строкой" })
  land_use: string;

  @ApiProperty()
  @ApiPropertyOptional()
  @IsString({ message: "Должно быть строкой" })
  land_class: string;

  @ApiProperty()
  @ApiPropertyOptional()
  @IsString({ message: "Должно быть строкой" })
  land_plot_title: string;

  @ApiProperty()
  @ApiPropertyOptional()
  railway_line: string;

  @ApiProperty()
  @ApiPropertyOptional()
  asphalt_pavement: string;

  @ApiProperty()
  @ApiPropertyOptional()
  electricity: string;

  @ApiProperty()
  @ApiPropertyOptional()
  gas: string;

  @ApiProperty()
  @ApiPropertyOptional()
  water_supply: string;

  @ApiProperty()
  @ApiPropertyOptional()
  sewage: string;

  @ApiProperty()
  @ApiPropertyOptional()
  highway_proximity: string;

  @ApiProperty()
  @ApiPropertyOptional()
  is_rent: string;

  @ApiProperty()
  @ApiPropertyOptional()
  flat_land_level: string;

  @ApiProperty()
  @ApiPropertyOptional()
  @IsString({ message: "Должно быть строкой" })
  phone: string;

  @ApiProperty()
  @IsNumber({}, { message: "Должно быть числом" })
  lat: number;

  @ApiProperty()
  @IsNumber({}, { message: "Должно быть числом" })
  lon: number;

  @ApiProperty()
  @ApiPropertyOptional()
  @IsString({ message: "Должно быть строкой" })
  date_published: string;

  @ApiProperty()
  @ApiPropertyOptional()
  @IsString({ message: "Должно быть строкой" })
  date_updated: string;

  @ApiProperty()
  @ApiPropertyOptional()
  @IsString({ message: "Должно быть строкой" })
  owner_name: string;

  @ApiProperty()
  @ApiPropertyOptional()
  @IsString({ message: "Должно быть строкой" })
  cadastral_number: string;

  @ApiProperty()
  @ApiPropertyOptional()
  @IsString({ message: "Должно быть строкой" })
  domain: string;

  @ApiProperty()
  @ApiPropertyOptional()
  @IsString({ message: "Должно быть строкой" })
  url: string;
}
