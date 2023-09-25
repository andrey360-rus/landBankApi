import { PickType } from "@nestjs/swagger";
import { CreateNoteDto } from "./create-note.dto";

export class GetAllBy_UserId_AnnouncementId_Dto extends PickType(
  CreateNoteDto,
  ["userId", "announcementId"] as const
) {}
