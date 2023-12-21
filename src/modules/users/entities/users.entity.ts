import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Role } from "src/modules/roles/entities/roles.entity";
import { Announcement } from "src/modules/announcement/entities/announcement.entity";
import { Note } from "src/modules/notes/entities/notes.entity";
import { RequestAnnouncement } from "src/modules/request-announcements/entities/request-announcement.entity";
import { Exclude } from "class-transformer";

@Entity("users")
export class User {
  @ApiProperty({ example: "1", description: "Уникальный идентификатор" })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: "user@mail.ru", description: "Почтовый адрес" })
  @Column("text")
  email: string;

  @ApiProperty({ example: "12345678", description: "Пароль" })
  @Exclude()
  @Column("text")
  password: string;

  @ApiProperty({
    example: false,
    description: "Статус регистрации пользователя",
  })
  @Column("boolean", { default: false, nullable: false, name: "is_active" })
  isActive: boolean;

  @ApiProperty({
    example: false,
    description: "Статус на получение роли крупного землепользователя",
  })
  @Column("boolean", {
    default: false,
    nullable: false,
    name: "is_land_user_obtain_status",
  })
  isLandUserObtainStatus: boolean;

  @ApiProperty({
    isArray: true,
    type: Role,
  })
  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({
    name: "user_roles",
    joinColumn: {
      name: "user_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "roles_id",
      referencedColumnName: "id",
    },
  })
  roles: Role[];

  @ApiProperty({
    isArray: true,
    type: Announcement,
  })
  @ManyToMany(() => Announcement, (announcement) => announcement.users)
  @JoinTable({
    name: "favorite_announcements",
    joinColumn: {
      name: "user_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "announcement_id",
      referencedColumnName: "id",
    },
  })
  favoritiesAnnouncements: Announcement[];

  @OneToMany(() => Announcement, (announcement) => announcement.user)
  announcements: Announcement[];

  @OneToMany(() => Note, (note) => note.user)
  notes: Note[];

  @OneToMany(
    () => RequestAnnouncement,
    (requestAnnouncement) => requestAnnouncement.user
  )
  requestAnnouncements: RequestAnnouncement[];
}
