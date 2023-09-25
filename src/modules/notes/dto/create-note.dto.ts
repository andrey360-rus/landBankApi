import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class CreateNoteDto {
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

  @ApiProperty({
    example:
      "Продам земельный участок 825кв.м. Отличный участок с фундаментом. Подходит под ИЖС.",
    description: "Описание заметки",
  })
  @IsString({ message: "Должно быть строкой" })
  description: string;
}
