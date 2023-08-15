import { PickType } from "@nestjs/swagger";
import { CreateAnnouncementDto } from "./create-announcement.dto";

export class ToggleCheckedAnnouncementDto extends PickType(
  CreateAnnouncementDto,
  ["id", "isChecked"] as const
) {}
