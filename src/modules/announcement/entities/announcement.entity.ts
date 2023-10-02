import {
  Column,
  Entity,
  Index,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/modules/users/entities/users.entity";
import { Note } from "src/modules/notes/entities/notes.entity";

@Entity("announcement")
@Index([
  "area",
  "address",
  "price",
  "domain",
  "land_category",
  "land_use",
  "is_rent",
  "date_published",
])
export class Announcement {
  @ApiProperty({
    example: "1",
    description: "Уникальный идентификатор объявления",
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: "Участок 20 соток",
    description: "Заголовок объявления",
  })
  @Column("text")
  title: string;

  @ApiProperty({
    example:
      "Продам земельный участок 825кв.м. Отличный участок с фундаментом. Подходит под ИЖС.",
    description: "Описание объявления",
  })
  @Column("text")
  description: string;

  @ApiProperty({
    example: "10000",
    description: "Площадь объекта в кв.м",
  })
  @Column("float")
  area: number;

  @ApiProperty({
    example:
      "Ставропольский край, Шпаковский муниципальный округ, Орловка садовое товарищество",
    description: "Адрес объекта",
  })
  @Column("text")
  address: string;

  @ApiProperty({
    example: "1000000",
    description: "Цена объекта в рублях",
  })
  @Column("float")
  price: number;

  @ApiProperty({
    type: "array",
    items: {
      type: "string",
      example:
        "https://cdn-p.cian.site/images/0/380/269/uchastok-laptevo-96208088-1.jpg",
    },
    description: "Фотографии объекта",
    nullable: true,
    required: false,
  })
  @Column("text", { array: true, nullable: true })
  photos: string[];

  @ApiProperty({
    example: "agricultural",
    description: "Категория объекта",
    nullable: true,
    required: false,
  })
  @Column({ nullable: true })
  land_category: string;

  @ApiProperty({
    example: "izhs",
    description: "Вид объекта",
    nullable: true,
  })
  @Column({ nullable: true })
  land_use: string;

  @ApiProperty({
    required: false,
  })
  @Column({ nullable: true })
  land_class: string;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  land_plot_title: string;

  @ApiProperty()
  @Column("boolean", { nullable: true })
  railway_line: boolean;

  @ApiProperty()
  @Column("boolean", { nullable: true })
  asphalt_pavement: boolean;

  @ApiProperty()
  @Column("boolean", { nullable: true })
  electricity: boolean;

  @ApiProperty()
  @Column("boolean", { nullable: true })
  gas: boolean;

  @ApiProperty()
  @Column("boolean", { nullable: true })
  water_supply: boolean;

  @ApiProperty()
  @Column("boolean", { nullable: true })
  sewage: boolean;

  @ApiProperty()
  @Column("boolean", { nullable: true })
  highway_proximity: boolean;

  @ApiProperty()
  @Column("boolean", { nullable: true })
  is_rent: boolean;

  @ApiProperty()
  @Column("boolean", { nullable: true })
  flat_land_level: boolean;

  @ApiProperty()
  @Column({ nullable: true })
  phone: string;

  @ApiProperty()
  @Column("double precision")
  lat: number;

  @ApiProperty()
  @Column("double precision")
  lon: number;

  @ApiProperty()
  @Column({ nullable: true })
  date_published: string;

  @ApiProperty()
  @Column({ nullable: true })
  date_updated: string;

  @ApiProperty()
  @Column({ nullable: true })
  owner_name: string;

  @ApiProperty()
  @Column({ nullable: true })
  cadastral_number: string;

  @ApiProperty()
  @Column({ nullable: true })
  domain: string;

  @ApiProperty()
  @Column({ nullable: true })
  url: string;

  @ApiProperty({
    example: false,
    description: "Флаг проверки объявления",
  })
  @Column({ nullable: true })
  isChecked: boolean;

  @ManyToMany(() => User, (user) => user.favoritiesAnnouncements, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  users: User[];

  @ManyToOne(() => User, (user) => user.announcements, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  user: User;

  @OneToMany(() => Note, (note) => note.announcement)
  notes: Note[];
}
