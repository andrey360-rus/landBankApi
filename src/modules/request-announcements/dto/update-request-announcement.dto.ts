import { PartialType, OmitType } from "@nestjs/mapped-types";
import { CreateRequestAnnouncementDto } from "./create-request-announcement.dto";

export class UpdateRequestAnnouncementDto extends PartialType(
  OmitType(CreateRequestAnnouncementDto, ["userId"] as const)
) {}
