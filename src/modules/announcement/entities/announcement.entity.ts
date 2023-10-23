import {
  Column,
  Entity,
  Index,
  JoinColumn,
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
  "price",
  "domain",
  "land_category",
  "land_use",
  "is_rent",
  "date_published",
  "region_kladr_id",
])
export class Announcement {
  @ApiProperty({
    example: 1,
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
  @Column("text", { nullable: true })
  land_category: string;

  @ApiProperty({
    example: "izhs",
    description: "Вид объекта",
    nullable: true,
  })
  @Column("text", { nullable: true })
  land_use: string;

  @ApiProperty({
    required: false,
  })
  @Column("text", { nullable: true })
  land_class: string;

  @ApiProperty({ required: false })
  @Column("text", { nullable: true })
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

  @ApiProperty({
    example: false,
    description: "Права пользования",
  })
  @Column("boolean")
  is_rent: boolean;

  @ApiProperty({ description: "Срок договора аренды" })
  @Column("timestamp", { nullable: true })
  rent_period: Date;

  @ApiProperty()
  @Column("boolean", { nullable: true })
  flat_land_level: boolean;

  @ApiProperty({
    example: "79001234567",
    description: "Номер телефона владельца объявления",
  })
  @Column("text", { nullable: true })
  phone: string;

  @ApiProperty({
    example: 55.676702,
    description: "Координата широты",
  })
  @Column("double precision")
  lat: number;

  @ApiProperty({ example: 37.763028, description: "Координата долготы" })
  @Column("double precision")
  lon: number;

  @ApiProperty({ description: "Дата публикации" })
  @Column("timestamp", { nullable: true })
  date_published: Date;

  @ApiProperty({ description: "Дата обновления" })
  @Column("timestamp", { nullable: true })
  date_updated: Date;

  @ApiProperty({
    example: "Владислав Черкас",
    description: "Владелец объявления",
  })
  @Column("text", { nullable: true })
  owner_name: string;

  @ApiProperty({
    example: "31:16:0123029:163",
    description: "Кадастровый номер",
  })
  @Column("text", { nullable: true })
  cadastral_number: string;

  @ApiProperty({
    example: "cian.ru",
    description: "Домен площадки, где размещено объявление",
  })
  @Column("text", { nullable: true })
  domain: string;

  @ApiProperty({
    example: "https://stavropol.cian.ru/sale/suburban/285629957/",
    description: "Адрес источника объявления",
  })
  @Column("text", { nullable: true })
  url: string;

  @ApiProperty({
    example: false,
    description: "Флаг проверки объявления",
  })
  @Column("boolean", { nullable: true })
  is_checked: boolean;

  @ApiProperty({
    example: "7700000000000",
    description: "КЛАДР-код региона",
  })
  @Column("text", { nullable: true })
  region_kladr_id: string;

  @ApiProperty({
    example: "arable",
    description: "Вид использования",
  })
  @Column("text", { nullable: true })
  type_of_use: string;

  @ApiProperty({
    example: "arable",
    description: "Выращиваемая культура",
  })
  @Column("text", { nullable: true })
  cultivated_crop: string;

  @ApiProperty({
    example: false,
    description: "Орошение",
  })
  @Column("boolean", { nullable: true })
  irrigation: boolean;

  @ApiProperty({
    example: false,
    description: "Межевание",
  })
  @Column("boolean", { nullable: true })
  survey: boolean;

  @ManyToMany(() => User, (user) => user.favoritiesAnnouncements, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  users: User[];

  @ManyToOne(() => User, (user) => user.announcements, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user: User;

  @OneToMany(() => Note, (note) => note.announcement)
  notes: Note[];
}
