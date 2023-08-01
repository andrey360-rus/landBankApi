import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class AddRoleDto {
  @ApiProperty({ example: "ADMIN", description: "Уникальное значение роли" })
  @IsString({ message: "Должно быть строкой" })
  readonly value: string;

  @ApiProperty({
    example: "1",
    description: "Уникальный идентификатор пользователя",
  })
  @IsNumber({}, { message: "Должно быть числом" })
  readonly userId: number;
}
