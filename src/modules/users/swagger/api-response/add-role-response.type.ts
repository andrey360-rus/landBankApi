import { ApiProperty } from "@nestjs/swagger";
import { User } from "../../entities/users.entity";

export class AddRoleErrorResponse {
  @ApiProperty({ example: "Пользователь или роль не найдены" })
  message: string;
}
