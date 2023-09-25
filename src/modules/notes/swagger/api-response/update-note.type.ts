import { ApiProperty } from "@nestjs/swagger";

export class UpdateNoteErrorNotFoundResponse {
  @ApiProperty({ example: "Заметка не найдена" })
  message: string;
}
