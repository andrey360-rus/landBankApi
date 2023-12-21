import { ApiProperty } from "@nestjs/swagger";
import { RequestAnnouncement } from "../../entities/request-announcement.entity";

export class FindAllRequestAnnouncementsApiOkResponse {
  @ApiProperty({
    isArray: true,
    type: RequestAnnouncement,
  })
  listRequestAnnouncement: RequestAnnouncement[];

  @ApiProperty({ example: 1 })
  totalCount: number;
}
