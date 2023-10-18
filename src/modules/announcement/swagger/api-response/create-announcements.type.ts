import { ApiProperty } from "@nestjs/swagger";

export class CreateAnnouncementsApiOkResponse {
  @ApiProperty({ example: "Объявления успешно добавлены" })
  message: string;
}
