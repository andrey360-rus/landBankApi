import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { NotesService } from "./notes.service";
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { CreateNoteDto } from "./dto/create-note.dto";
import { Note } from "./entities/notes.entity";
import { GetAllBy_UserId_AnnouncementId_Dto } from "./dto/get-all-by-userId-announcementId.dto";
import { UpdateNoteDto } from "./dto/update-note.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import {
  RemoveNoteErrorNotFoundResponse,
  RemoveNoteOkResponse,
} from "./swagger/api-response/remove-note.type";
import { UpdateNoteErrorNotFoundResponse } from "./swagger/api-response/update-note.type";

@Controller("notes")
@ApiTags("Заметки объявлений")
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @ApiOperation({ summary: "Добавить заметку к объявлению" })
  @ApiOkResponse({
    type: Note,
    description: "Добавляет заметку для объявления",
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post("add")
  create(@Body() noteDto: CreateNoteDto) {
    return this.notesService.create(noteDto);
  }

  @ApiOperation({ summary: "Получить заметки объявления по пользователю" })
  @ApiOkResponse({
    type: [Note],
    description: "Возвращает массив заметок пользователя для объявления",
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  getAll(
    @Query()
    dto: GetAllBy_UserId_AnnouncementId_Dto
  ) {
    return this.notesService.getAll(dto);
  }

  @ApiOperation({ summary: "Обновить заметку" })
  @ApiOkResponse({ type: Note, description: "Заметка успешно обновлена" })
  @ApiNotFoundResponse({
    type: UpdateNoteErrorNotFoundResponse,
    description: "Заметка не найдена",
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateNoteDto: UpdateNoteDto) {
    return this.notesService.update(+id, updateNoteDto);
  }

  @ApiOperation({ summary: "Удалить заметку" })
  @ApiOkResponse({
    type: RemoveNoteOkResponse,
    description: "Заметка успешно удалена",
  })
  @ApiNotFoundResponse({
    type: RemoveNoteErrorNotFoundResponse,
    description: "Заметка не найдена",
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.notesService.remove(+id);
  }
}
