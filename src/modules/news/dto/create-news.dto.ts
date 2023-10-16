import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { NewsSections } from "../news.enum";
import { DeepPartial } from "typeorm";

export class CreateNewsDto {
  @ApiProperty({
    example: "Мукомольная отрасль России: текущая ситуация и тенденции",
    description: "Заголовок новости",
  })
  @IsNotEmpty({ message: "Не может быть пустым" })
  @IsString({ message: "Должно быть строкой" })
  title: string;

  @ApiProperty({
    example:
      "В статье приведены результаты анализа текущего состояния и определены основные тенденции развития мукомольной отрасли в РФ (внутренний рынок и экспорт), определена сезонность производства и реализации мукомольной продукции с выявлением динамического ценообразования, рассмотрены ключевые факторы / драйверы формирования стоимости мукомольных предприятий.",
    description: "Аннотация новости",
  })
  @IsNotEmpty({ message: "Не может быть пустым" })
  @IsString({ message: "Должно быть строкой" })
  annotation: string;

  @ApiProperty({
    description: "Файл статьи",
    format: "binary",
  })
  @IsNotEmpty({ message: "Не может быть пустым" })
  @IsString({ message: "Должно быть строкой" })
  article: string;

  @ApiProperty({
    example: "analytics",
    description: "Раздел новости",
  })
  @IsNotEmpty({ message: "Не может быть пустым" })
  @IsEnum(NewsSections)
  section: DeepPartial<NewsSections>;
}
