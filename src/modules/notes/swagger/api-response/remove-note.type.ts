import { ApiProperty } from "@nestjs/swagger";
import { UpdateNoteErrorNotFoundResponse } from "./update-note.type";

export class RemoveNoteOkResponse {
  @ApiProperty({ example: 1 })
  id: number;
}

export class RemoveNoteErrorNotFoundResponse extends UpdateNoteErrorNotFoundResponse {}
