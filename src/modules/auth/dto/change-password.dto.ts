import { IsString, IsNotEmpty, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(8, {
    message: "Не меньше 8 символов",
  })
  @ApiProperty()
  readonly password: string;
}
