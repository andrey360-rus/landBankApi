import { ApiProperty, OmitType } from "@nestjs/swagger";
import { CreateAnnouncementDto } from "./create-announcement.dto";
import { IsBoolean, IsString } from "class-validator";

export class CreateOneAnnouncementDto extends OmitType(CreateAnnouncementDto, [
  "id",
] as const) {
  @ApiProperty({
    example: 1,
    description: "Уникальный идентификатор пользователя",
  })
  userId: number;

  @ApiProperty({
    example: 55.676702,
    description: "Координата широты",
  })
  geo_lat: number;

  @ApiProperty({ example: 37.763028, description: "Координата долготы" })
  geo_lon: number;

  @ApiProperty({
    example: false,
    description: "Флаг проверки объявления",
  })
  @IsBoolean({ message: "Должно быть булевым значением" })
  isChecked: boolean;

  @ApiProperty({
    example: "31.01.2024",
    description: "Срок договора аренды",
  })
  @IsString({ message: "Должно быть строкой" })
  rentPeriod: string;

  @ApiProperty({
    example: "arable",
    description: "Вид использования",
  })
  @IsString({ message: "Должно быть строкой" })
  type_of_use: string;

  @ApiProperty({
    example: "false",
    description: "Орошение",
  })
  @IsString({ message: "Должно быть строкой" })
  irrigation: string;

  @ApiProperty({
    example: "false",
    description: "Орошение",
  })
  @IsString({ message: "Должно быть строкой" })
  survey: string;

  @ApiProperty({
    example: "пшеница",
    description: "Выращиваемая культура",
  })
  @IsString({ message: "Должно быть строкой" })
  cultivated_crop: string;
}
