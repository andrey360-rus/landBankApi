import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean } from "class-validator";

export class FindAllUsersDto {
  @ApiProperty({
    example: false,
    description: "Статус на получение роли крупного землепользователя",
  })
  @IsBoolean()
  readonly isLandUserObtainStatus: boolean;
}
