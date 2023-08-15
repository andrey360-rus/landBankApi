import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Role } from "src/modules/roles/entities/roles.entity";

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
}
