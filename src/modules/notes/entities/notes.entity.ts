import { ApiProperty } from "@nestjs/swagger";
import { Announcement } from "src/modules/announcement/entities/announcement.entity";
import { User } from "src/modules/users/entities/users.entity";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("notes")
export class Note {
  @ApiProperty({
    example: "1",
    description: "Уникальный идентификатор заметки",
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example:
      "Продам земельный участок 825кв.м. Отличный участок с фундаментом. Подходит под ИЖС.",
    description: "Описание заметки",
  })
  @Column("text")
  description: string;

  @ManyToOne(() => User, (user) => user.notes, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => Announcement, (announcement) => announcement.notes, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "announcement_id" })
  announcement: Announcement;

  @Column("text")
  create_at: string;
}
