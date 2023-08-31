import { ApiProperty } from "@nestjs/swagger";

export class GetFavoritiesAnnouncements {
  @ApiProperty({ example: "Пользователь не найден" })
  message: string;
}
