import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectConnection } from "@nestjs/typeorm";
import { Connection } from "typeorm";
import { CreateNoteDto } from "./dto/create-note.dto";
import { GetAllBy_UserId_AnnouncementId_Dto } from "./dto/get-all-by-userId-announcementId.dto";
import { UpdateNoteDto } from "./dto/update-note.dto";
import { Note } from "./entities/notes.entity";
import { DatesService } from "src/utils/dates/dates.service";

@Injectable()
export class NotesService {
  constructor(
    @InjectConnection()
    private readonly connection: Connection,
    private readonly datesService: DatesService
  ) {}

  async create(dto: CreateNoteDto) {
    const { userId, announcementId, description } = dto;

    const create_at = this.datesService.formateDate(new Date());

    const noteOptions = {
      description,
      user: {
        id: userId,
      },
      announcement: {
        id: announcementId,
      },
      create_at,
    };
    const note = await this.connection.manager.save(Note, noteOptions);

    return note;
  }

  async getAll(dto: GetAllBy_UserId_AnnouncementId_Dto) {
    const { userId, announcementId } = dto;

    const [listNotes, totalCount] = await this.connection.manager.findAndCount(
      Note,
      {
        order: { id: "DESC" },
        where: {
          user: { id: userId },
          announcement: { id: announcementId },
        },
      }
    );

    return { listNotes, totalCount };
  }

  async update(noteId: number, dto: UpdateNoteDto) {
    const { description } = dto;

    const note = await this.connection.manager.findOne(Note, {
      where: { id: noteId },
      relations: ["user", "announcement"],
    });

    if (note) {
      const update_at = this.datesService.formateDate(new Date());
      const noteOptions = {
        ...note,
        description,
        create_at: update_at,
      };

      const updatedNote = await this.connection.manager.save(Note, noteOptions);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { user, announcement, ...rest } = updatedNote;

      return rest;
    }

    throw new HttpException("Заметка не найдена", HttpStatus.NOT_FOUND);
  }

  async remove(noteId: number) {
    await this.connection.manager.delete(Note, { id: noteId });
    return { id: noteId };
  }
}
