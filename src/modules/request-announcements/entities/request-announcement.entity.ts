import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/modules/users/entities/users.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import {
  RequestAnnouncementsLandCategory,
  RequestAnnouncementsLandUse,
  RequestAnnouncementsTypeOfUse,
} from "../request-announcements.enum";

// const landUseArr = Object.values(RequestAnnouncementsLandUse);

@Entity("request_announcements")
export class RequestAnnouncement {
  @ApiProperty({
    example: 1,
    description: "Уникальный идентификатор объявления-запроса",
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: "1",
    description: "Минимальная площадь объекта в кв.м",
  })
  @Column("float", { name: "area_from", nullable: true })
  areaFrom: number;

  @ApiProperty({
    example: "10",
    description: "Максимальная площадь объекта в кв.м",
  })
  @Column("float", { name: "area_to", nullable: true })
  areaTo: number;

  @ApiProperty({
    example: "1000000",
    description: "Минимальная цена объекта в рублях",
  })
  @Column("float", { name: "price_from", nullable: true })
  priceFrom: number;

  @ApiProperty({
    example: "10000000",
    description: "Максимальная цена объекта в рублях",
  })
  @Column("float", { name: "price_to", nullable: true })
  priceTo: number;

  @ApiProperty({
    enum: RequestAnnouncementsLandCategory,
    example: RequestAnnouncementsLandCategory.URBAN,
    description: "Категория объекта",
  })
  @Column({
    name: "land_category",
    type: "enum",
    enum: RequestAnnouncementsLandCategory,
  })
  landCategory: RequestAnnouncementsLandCategory;

  @ApiProperty({
    enum: RequestAnnouncementsLandUse,
    example: RequestAnnouncementsLandUse.IZHS,
    description: "Вид объекта",
  })
  @Column({
    name: "land_use",
    type: "enum",
    enum: RequestAnnouncementsLandUse,
    array: true,
    nullable: true,
  })
  // @Column("text", { name: "land_use", array: true })
  landUse: RequestAnnouncementsLandUse[];

  @ApiProperty({
    example: "arable",
  })
  @ApiProperty({
    enum: RequestAnnouncementsTypeOfUse,
    example: RequestAnnouncementsTypeOfUse.ARABLE,
    description: "Вид использования",
  })
  @Column({
    name: "type_of_use",
    type: "enum",
    enum: RequestAnnouncementsTypeOfUse,
    array: true,
    nullable: true,
  })
  // @Column("text", { name: "type_of_use", array: true })
  typeOfUse: RequestAnnouncementsTypeOfUse[];

  // @ApiProperty({
  //   example: "arable",
  //   description: "Выращиваемая культура",
  // })
  // @Column("text", { nullable: true })
  // cultivated_crop: string;

  // @ApiProperty({
  //   name: 'is_rent',
  //   example: false,
  //   description: "Права пользования",
  // })
  // @Column("boolean", { nullable: true })
  // isRent: boolean;

  @ApiProperty({
    example: false,
    description: "Орошение",
  })
  @Column("boolean", { nullable: true })
  irrigation?: boolean;

  @ApiProperty({
    example: false,
    description: "Межевание",
  })
  @Column("boolean", { nullable: true })
  survey?: boolean;

  @ManyToOne(() => User, (user) => user.requestAnnouncements, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user: User;
}
