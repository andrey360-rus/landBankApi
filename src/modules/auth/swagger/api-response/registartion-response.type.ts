import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/modules/users/entities/users.entity";

export class RegistrationOkResponse {
  @ApiProperty()
  user: User;

  @ApiProperty({
    example:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ1c2VyQG1haWwucnUiLCJwYXNzd29yZCI6IjEyMzQ1Njc4Iiwicm9sZXMiOlt7ImlkIjoxLCJ2YWx1ZSI6IkFETUlOIiwiZGVzY3JpcHRpb24iOiLQkNC00LzQuNC90LjRgdGC0YDQsNGC0L7RgCJ9XSwiaWF0IjoxNjkxMzk4NzM3LCJleHAiOjE2OTE0ODUxMzd9.2GsHRs5_MtRHa83MsHkG3gA3FDtEjTqbi4r_ySl8h-M",
  })
  token: string;
}

export class RegistrationBadRequestErrorResponse {
  @ApiProperty({
    example: "Некорректная почта или пароль",
  })
  message: string;

  @ApiProperty({
    example: "400",
  })
  status: number;
}
