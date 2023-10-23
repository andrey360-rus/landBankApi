import { PartialType } from "@nestjs/mapped-types";

import { ApiProperty } from "@nestjs/swagger";
import { CreateOneAnnouncementDto } from "./create-one-announcement.dto";

export class UpdateAnnouncementDto extends PartialType(
  CreateOneAnnouncementDto
) {
  @ApiProperty({
    type: "array",
    items: {
      type: "string",
      example: "http://localhost:3000/58bf8f05-f657-4d22-8aec-5cc99cdaa990.jpg",
    },
    description: "Фотографии объекта",
  })
  removableFiles: string[];
}
