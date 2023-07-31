import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/modules/users/entities/users.entity";

@Entity("roles")
export class Role {
  @ApiProperty({ example: "1", description: "Уникальный идентификатор" })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: "ADMIN", description: "Уникальное значение роли" })
  @Column("text")
  value: string;

  @ApiProperty({ example: "Администратор", description: "Описание роли" })
  @Column("text")
  description: string;

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];
}
