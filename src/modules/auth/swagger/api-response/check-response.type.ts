import { ApiProperty } from "@nestjs/swagger";

export class CheckOkResponse {
  @ApiProperty({
    example:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ1c2VyQG1haWwucnUiLCJwYXNzd29yZCI6IjEyMzQ1Njc4Iiwicm9sZXMiOlt7ImlkIjoxLCJ2YWx1ZSI6IkFETUlOIiwiZGVzY3JpcHRpb24iOiLQkNC00LzQuNC90LjRgdGC0YDQsNGC0L7RgCJ9XSwiaWF0IjoxNjkxMzk4NzM3LCJleHAiOjE2OTE0ODUxMzd9.2GsHRs5_MtRHa83MsHkG3gA3FDtEjTqbi4r_ySl8h-M",
  })
  token: string;
}

export class CheckErrorResponse {
  @ApiProperty({
    example: "Пользователь не авторизован",
  })
  message: string;
}
