import { ApiProperty } from "@nestjs/swagger";

export class AddRoleErrorResponse {
  @ApiProperty({ example: "Пользователь или роль не найдены" })
  message: string;
}
