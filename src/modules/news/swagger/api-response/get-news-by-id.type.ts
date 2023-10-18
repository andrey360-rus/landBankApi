import { ApiProperty } from "@nestjs/swagger";

export class GetNewsById {
  @ApiProperty({ example: "Новость с таким идентификатором не найдена" })
  message: string;
}
