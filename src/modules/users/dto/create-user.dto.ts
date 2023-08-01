import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";

export class CreateUserDto {
  @ApiProperty({ example: "user@mail.ru", description: "Почтовый адрес" })
  @IsString({ message: "Должно быть строкой" })
  @IsEmail({}, { message: "Некорректная почта" })
  readonly email: string;

  @ApiProperty({ example: "12345678", description: "Пароль" })
  @IsString({ message: "Должно быть строкой" })
  @MinLength(8, {
    message: "Не меньше 8 символов",
  })
  readonly password: string;
}
