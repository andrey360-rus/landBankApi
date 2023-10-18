import { ApiProperty, OmitType } from "@nestjs/swagger";
import { CreateAnnouncementDto } from "./create-announcement.dto";

export class CreateOneAnnouncementDto extends OmitType(CreateAnnouncementDto, [
  "id",
] as const) {
  @ApiProperty({
    example: 1,
    description: "Уникальный идентификатор пользователя",
  })
  userId: number;

  @ApiProperty({
    example: 55.676702,
    description: "Координата широты",
  })
  geo_lat: number;

  @ApiProperty({ example: 37.763028, description: "Координата долготы" })
  geo_lon: number;
}
