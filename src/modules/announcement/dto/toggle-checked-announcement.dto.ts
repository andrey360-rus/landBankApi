import { ApiProperty } from "@nestjs/swagger";

export class ToggleCheckedAnnouncementDto {
  @ApiProperty({
    example: 1,
    description: "Уникальный идентификатор объявления",
  })
  id: number;

  @ApiProperty({
    example: true,
    description: "Флаг проверки объявления",
  })
  isChecked: boolean;
}
