import { ApiProperty } from "@nestjs/swagger";
import { User } from "../../entities/users.entity";

export class FindAllOkResponse {
  @ApiProperty()
  listUsers: User[]; // не работает

  @ApiProperty({ example: 1 })
  totalCount: number;
}
