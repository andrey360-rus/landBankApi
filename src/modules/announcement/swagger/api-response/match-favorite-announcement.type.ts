import { ApiProperty } from "@nestjs/swagger";

export class MatchFavoriteAnnouncementOkResponse {
  @ApiProperty({ example: true })
  isFavorite: boolean;
}

export class MatchFavoriteAnnouncementErrorResponse {
  @ApiProperty({ example: "Объявление не найдено" })
  message: string;
}
