import { ApiProperty } from "@nestjs/swagger";

export class GetRequestAnnouncementDto {
  @ApiProperty({ example: 1, required: false })
  userId?: number;

  @ApiProperty({ example: 100 })
  limit: number;

  @ApiProperty({ example: 1 })
  page: number;
}
