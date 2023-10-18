import { ApiProperty } from "@nestjs/swagger";
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { NewsSections } from "../news.enum";

@Entity("news")
export class News {
  @ApiProperty({
    example: "1",
    description: "Уникальный идентификатор новости",
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: "Мукомольная отрасль России: текущая ситуация и тенденции",
    description: "Заголовок новости",
  })
  @Column("text")
  title: string;

  @ApiProperty({
    example:
      "В статье приведены результаты анализа текущего состояния и определены основные тенденции развития мукомольной отрасли в РФ (внутренний рынок и экспорт), определена сезонность производства и реализации мукомольной продукции с выявлением динамического ценообразования, рассмотрены ключевые факторы / драйверы формирования стоимости мукомольных предприятий.",
    description: "Аннотация новости",
  })
  @Column("text")
  annotation: string;

  @ApiProperty({ description: "Дата создания новости" })
  @CreateDateColumn({
    type: "timestamp with time zone",
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  create_at: Date;

  @ApiProperty({ description: "Дата обновления новости" })
  @UpdateDateColumn({
    type: "timestamp with time zone",
    default: () => "CURRENT_TIMESTAMP(6)",
    onUpdate: "CURRENT_TIMESTAMP(6)",
  })
  update_at: Date;

  @ApiProperty({
    example: "f41c1b1a-40a8-474a-b42a-21a7c201be01.pdf",
    description: "Имя файла новости",
  })
  @Column("text")
  article: string;

  @ApiProperty({
    example: "analytics",
    description: "Раздел новости",
  })
  @Column({
    type: "enum",
    enum: NewsSections,
  })
  section: NewsSections;
}
