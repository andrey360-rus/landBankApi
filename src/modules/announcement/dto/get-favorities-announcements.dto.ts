import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class GetFavoritiesAnnouncementsDto {
  @ApiProperty({
    example: "1",
    description: "Уникальный идентификатор пользователя",
  })
  @IsNumber({}, { message: "Должно быть числом" })
  userId: number;
}
