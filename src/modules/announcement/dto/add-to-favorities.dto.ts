import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class AddToFavoritiesDto {
  @ApiProperty({
    example: "1",
    description: "Уникальный идентификатор пользователя",
  })
  @IsNumber({}, { message: "Должно быть числом" })
  userId: number;

  @ApiProperty({
    example: "1",
    description: "Уникальный идентификатор объявления",
  })
  @IsNumber({}, { message: "Должно быть числом" })
  announcementId: number;
}
