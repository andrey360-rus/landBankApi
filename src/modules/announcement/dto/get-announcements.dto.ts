import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  AnnouncementShowMethodEnum,
  AnnouncementStatusesEnum,
  AreaUnitEnum,
} from "../announcement.enum";

export class GetAnnouncementsDto {
  @ApiProperty({
    example: 5,
    default: 1,
    description: "Номер страницы с объявлениями",
  })
  @ApiPropertyOptional()
  page?: number;

  @ApiProperty({
    example: 100,
    default: 100,
    description: "Лимит объявлений",
  })
  @ApiPropertyOptional()
  limit?: number;

  @ApiProperty({
    example: 10_000_000,
    default: Infinity,
    description: 'Цена "до"',
  })
  @ApiPropertyOptional()
  price_to?: number;

  @ApiProperty({ example: 100000, default: 1, description: 'Цена "от"' })
  @ApiPropertyOptional()
  price_from?: number;

  @ApiProperty({ example: 10, default: Infinity, description: 'Площадь "до"' })
  @ApiPropertyOptional()
  area_to?: number;

  @ApiProperty({ example: 2, default: 1, description: 'Площадь "от"' })
  @ApiPropertyOptional()
  area_from?: number;

  @ApiProperty({
    example: "avito.ru",
    default: undefined,
    description: "Домен площадки источника объявления",
  })
  @ApiPropertyOptional()
  domain?: string;

  @ApiProperty({
    type: "array",
    items: {
      type: "string",
      example: "7700000000000",
    },
    description: "Массив КЛАДР-код регионов",
    nullable: true,
    default: undefined,
  })
  @ApiPropertyOptional()
  address?: string;

  @ApiProperty({
    enum: AreaUnitEnum,
    default: AreaUnitEnum.HECTARES,
    description: "Едицины измерения площади",
  })
  @ApiPropertyOptional()
  areaUnit?: string;

  @ApiProperty({
    example: true,
    default: false,
    description: "Право собственности",
  })
  @ApiPropertyOptional()
  is_rent: boolean;

  @ApiProperty({
    example: "фундамент",
    default: undefined,
    description: "Слово в описании",
  })
  @ApiPropertyOptional()
  keyword?: string;

  @ApiProperty({
    example: "7",
    default: undefined,
    description: "Период публикации",
  })
  @ApiPropertyOptional()
  date_range?: string;

  @ApiProperty({
    example: "izhs",
    default: undefined,
    description: "Землепользование",
  })
  @ApiPropertyOptional()
  land_use?: string;

  @ApiProperty({
    example: "urban",
    default: undefined,
    description: "Категория земель",
  })
  @ApiPropertyOptional()
  land_category?: string;

  @ApiProperty({
    example: '{"price":"ASC"}',
    description: "Сортировка",
    default: '{"id":"DESC"}',
  })
  sorting: string;

  @ApiProperty({
    enum: AnnouncementShowMethodEnum,
    default: AnnouncementShowMethodEnum.LIST,
    description: "Метод показа объявлений",
  })
  @ApiPropertyOptional()
  provideTag: string;

  @ApiProperty({
    example: "1",
    default: undefined,
    description: "Уникальный идентификатор пользователя",
  })
  @ApiPropertyOptional()
  userId?: number;

  @ApiProperty({
    example: "7700000000000",
    default: undefined,
    description: "КЛАДР-код региона",
  })
  @ApiPropertyOptional()
  regionKladrId?: string;

  @ApiProperty({
    example:
      "45.528087123383635%2C30.393650714062513%2C48.88797931590286%2C49.0154768859375",
    default: undefined,
    description: "Координаты видимой области карты",
  })
  @ApiPropertyOptional()
  geoBounds?: string;

  @ApiProperty({
    enum: AnnouncementStatusesEnum,
    example: AnnouncementStatusesEnum.AWAIT,
    default: AnnouncementStatusesEnum.ACTIVE,
    description: "Статус объявления",
  })
  status: string;
}
