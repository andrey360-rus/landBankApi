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

@Entity("users")
export class User {
  @ApiProperty({ example: "1", description: "Уникальный идентификатор" })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: "user@mail.ru", description: "Почтовый адрес" })
  @Column("text")
  email: string;

  @ApiProperty({ example: "12345678", description: "Пароль" })
  @Column("text")
  password: string;

  @ApiProperty({
    type: "array",
    items: {
      example: {
        id: 1,
        value: "ADMIN",
        description: "Администратор",
      },
    },
  })
  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({
    name: "user_roles",
  })
  roles: Role[];

  @ApiProperty({
    type: "array",
    items: {
      example: {
        Announcement,
      },
    },
  })
  // @ApiProperty({
  //   type: "array",
  //   items: {
  //     example: {
  //       id: 1,
  //       value: "ADMIN",
  //       description: "Администратор",
  //     },
  //   },
  // })
  @ManyToMany(() => Announcement, (announcement) => announcement.users)
  @JoinTable({
    name: "favorite_announcements",
  })
  favoritiesAnnouncements: Announcement[];

  @OneToMany(() => Announcement, (announcement) => announcement.user)
  announcements: Announcement[];
}
