import { ApiProperty } from "@nestjs/swagger";

export class SetStatusUserDto {
  @ApiProperty({
    example: 1,
    description: "Уникальный идентификатор пользователя",
  })
  id: number;

  @ApiProperty({
    example: false,
    description: "Статус регистрации пользователя",
  })
  isActive: boolean;
}
