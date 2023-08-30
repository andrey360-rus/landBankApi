import { ApiProperty } from "@nestjs/swagger";

export class AddToFavoritiesAnnouncementsErrorResponse {
  @ApiProperty({ example: "Пользователь или объявление не найдены" })
  message: string;
}
