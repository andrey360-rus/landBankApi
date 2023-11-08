import { ApiProperty } from "@nestjs/swagger";
import { AnnouncementStatusesEnum } from "../announcement.enum";

export class SetStatusAnnouncementDto {
  @ApiProperty({
    example: 1,
    description: "Уникальный идентификатор объявления",
  })
  id: number;

  @ApiProperty({
    enum: AnnouncementStatusesEnum,
    example: AnnouncementStatusesEnum.INACTIVE,
    description: "Статус объявления",
  })
  status: string;
}
