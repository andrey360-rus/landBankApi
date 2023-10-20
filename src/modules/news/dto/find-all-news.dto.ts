import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class FindAllNewsDto {
  @ApiProperty()
  @ApiPropertyOptional()
  section?: string;
}
