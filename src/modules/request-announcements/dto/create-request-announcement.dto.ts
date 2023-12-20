import { ApiProperty } from "@nestjs/swagger";
import {
  RequestAnnouncementsLandCategory,
  RequestAnnouncementsLandUse,
  RequestAnnouncementsTypeOfUse,
} from "../request-announcements.enum";

export class CreateRequestAnnouncementDto {
  @ApiProperty({
    example: "1",
    description: "Минимальная площадь объекта в кв.м",
  })
  areaFrom?: number;

  @ApiProperty({
    example: "10",
    description: "Максимальная площадь объекта в кв.м",
  })
  areaTo?: number;

  @ApiProperty({
    example: "1000000",
    description: "Минимальная цена объекта в рублях",
  })
  priceFrom?: number;

  @ApiProperty({
    example: "10000000",
    description: "Максимальная цена объекта в рублях",
  })
  priceTo?: number;

  @ApiProperty({
    example: "agricultural",
    description: "Категория объекта",
    nullable: true,
    required: false,
  })
  landCategory: RequestAnnouncementsLandCategory;

  @ApiProperty({
    example: "izhs",
    description: "Вид объекта",
    nullable: true,
    required: false,
  })
  landUse: RequestAnnouncementsLandUse[];

  @ApiProperty({
    example: "arable",
    description: "Вид использования",
  })
  typeOfUse: RequestAnnouncementsTypeOfUse[];

  // @ApiProperty({
  //   example: "arable",
  //   description: "Выращиваемая культура",
  // })
  // cultivated_crop?: string;

  // @ApiProperty({
  //   example: false,
  //   description: "Права пользования",
  // })
  // is_rent?: boolean;

  @ApiProperty({
    example: "false",
    description: "Орошение",
  })
  irrigation?: string;

  @ApiProperty({
    example: "false",
    description: "Межевание",
  })
  survey?: string;

  @ApiProperty({
    example: 1,
    description: "Уникальный идентификатор пользователя",
  })
  userId: number;
}
