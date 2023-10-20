import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { NewsService } from "./news.service";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { News } from "./entities/news.entity";
import { CreateNewsDto } from "./dto/create-news.dto";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles-auth.decorator";
import { UpdateNewsDto } from "./dto/update-news.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { storage } from "./news.constant";
import { GetNewsById } from "./swagger/api-response/get-news-by-id.type";
import { FindAllNewsDto } from "./dto/find-all-news.dto";

@Controller("news")
@ApiTags("Новости")
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @ApiOperation({ summary: "Создать новость" })
  @ApiResponse({
    status: 201,
    type: News,
    description: "Новость успешно создана",
  })
  @ApiBearerAuth()
  @ApiConsumes("multipart/form-data")
  @ApiBody({ type: CreateNewsDto })
  @Roles("ADMIN", "ADS_EDITOR")
  @UseGuards(RolesGuard)
  @Post("create")
  @UseInterceptors(FileInterceptor("article", storage))
  create(
    @UploadedFile() article: Express.Multer.File,
    @Body() createNewsDto: CreateNewsDto
  ) {
    return this.newsService.create(createNewsDto, article);
  }

  @ApiOperation({ summary: "Получить новости" })
  @ApiOkResponse({ type: [News], description: "Возвращает массив новостей" })
  @ApiQuery({
    name: "section",
    required: false,
    description: "Раздел новости",
    example: "analytics",
  })
  @Get()
  findAll(@Query() findAllNewsDto: FindAllNewsDto) {
    return this.newsService.findAll(findAllNewsDto);
  }

  @ApiOperation({ summary: "Получить новость по id" })
  @ApiOkResponse({
    type: News,
    description: "Возвращает новость по ее идентификатору",
  })
  @ApiNotFoundResponse({
    description: "Новость не найдена",
    type: GetNewsById,
  })
  @Get(":id")
  findOne(@Param("id") id: number) {
    return this.newsService.findOne(id);
  }

  @ApiOperation({ summary: "Обновить новость" })
  @ApiOkResponse({
    type: News,
    description: "Новость успешно обновлена",
  })
  @ApiNotFoundResponse({
    description: "Новость не найдена",
    type: GetNewsById,
  })
  @ApiBearerAuth()
  @ApiConsumes("multipart/form-data")
  @ApiBody({ type: UpdateNewsDto })
  @ApiParam({
    name: "id",
    description: "Уникальный идентификатор новости",
    example: 1,
  })
  @Roles("ADMIN", "ADS_EDITOR")
  @UseGuards(RolesGuard)
  @Patch(":id")
  @UseInterceptors(FileInterceptor("article", storage))
  update(
    @UploadedFile() article: Express.Multer.File,
    @Param("id") id: number,
    @Body() updateNewsDto: UpdateNewsDto
  ) {
    return this.newsService.update(id, updateNewsDto, article);
  }

  @ApiOperation({ summary: "Удалить новость" })
  @ApiOkResponse({
    type: News,
    description: "Новость успешно удалена",
  })
  @ApiBearerAuth()
  @ApiParam({
    name: "id",
    description: "Уникальный идентификатор новости",
    example: 1,
  })
  @ApiNotFoundResponse({
    description: "Новость не найдена",
    type: GetNewsById,
  })
  @Roles("ADMIN", "ADS_EDITOR")
  @UseGuards(RolesGuard)
  @Delete(":id")
  remove(@Param("id") id: number) {
    return this.newsService.remove(id);
  }
}
