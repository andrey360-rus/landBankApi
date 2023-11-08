import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsNumber, IsString } from "class-validator";

export class CreateAnnouncementDto {
  @ApiProperty({
    example: 1,
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
  @IsBoolean({ message: "Должно быть булевым значением" })
  railway_line: boolean;

  @ApiProperty()
  @ApiPropertyOptional()
  @IsBoolean({ message: "Должно быть булевым значением" })
  asphalt_pavement: boolean;

  @ApiProperty()
  @ApiPropertyOptional()
  @IsBoolean({ message: "Должно быть булевым значением" })
  electricity: boolean;

  @ApiProperty()
  @ApiPropertyOptional()
  @IsBoolean({ message: "Должно быть булевым значением" })
  gas: boolean;

  @ApiProperty()
  @ApiPropertyOptional()
  @IsBoolean({ message: "Должно быть булевым значением" })
  water_supply: boolean;

  @ApiProperty()
  @ApiPropertyOptional()
  @IsBoolean({ message: "Должно быть булевым значением" })
  sewage: boolean;

  @ApiProperty()
  @ApiPropertyOptional()
  @IsBoolean({ message: "Должно быть булевым значением" })
  highway_proximity: boolean;

  @ApiProperty({
    example: false,
    description: "Права пользования",
  })
  @ApiPropertyOptional()
  @IsBoolean({ message: "Должно быть булевым значением" })
  is_rent: boolean;

  @ApiProperty()
  @ApiPropertyOptional()
  @IsBoolean({ message: "Должно быть булевым значением" })
  flat_land_level: boolean;

  @ApiProperty({
    example: "79001234567",
    description: "Номер телефона владельца объявления",
  })
  @ApiPropertyOptional()
  @IsString({ message: "Должно быть строкой" })
  phone: string;

  @ApiProperty({
    example: 55.676702,
    description: "Координата широты",
  })
  @IsNumber({}, { message: "Должно быть числом" })
  lat: number;

  @ApiProperty({ example: 37.763028, description: "Координата долготы" })
  @IsNumber({}, { message: "Должно быть числом" })
  lon: number;

  @ApiProperty({ description: "Дата публикации" })
  @ApiPropertyOptional()
  @IsString({ message: "Должно быть строкой" })
  date_published: string;

  @ApiProperty({ description: "Дата обновления" })
  @ApiPropertyOptional()
  @IsString({ message: "Должно быть строкой" })
  date_updated: string;

  @ApiProperty({
    example: "Владислав Черкас",
    description: "Владелец объявления",
  })
  @ApiPropertyOptional()
  @IsString({ message: "Должно быть строкой" })
  owner_name: string;

  @ApiProperty({
    example: "31:16:0123029:163",
    description: "Кадастровый номер",
  })
  @ApiPropertyOptional()
  @IsString({ message: "Должно быть строкой" })
  cadastral_number: string;

  @ApiProperty({
    example: "cian.ru",
    description: "Домен площадки, где размещено объявление",
  })
  @ApiPropertyOptional()
  @IsString({ message: "Должно быть строкой" })
  domain: string;

  @ApiProperty({
    example: "https://stavropol.cian.ru/sale/suburban/285629957/",
    description: "Адрес источника объявления",
  })
  @ApiPropertyOptional()
  @IsString({ message: "Должно быть строкой" })
  url: string;

  @ApiProperty({
    example: "7700000000000",
    description: "КЛАДР-код региона",
  })
  @IsString({ message: "Должно быть строкой" })
  region_kladr_id: string;

  @ApiProperty({
    example: "1000000",
    description: "Цена за единицу площади",
  })
  @IsNumber({}, { message: "Должно быть числом" })
  unit_price: number;
}
