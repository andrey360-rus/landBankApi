import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from "@nestjs/common";
import { AnnouncementService } from "./announcement.service";
import { CreateAnnouncementDto } from "./dto/create-announcement.dto";
import { UpdateAnnouncementDto } from "./dto/update-announcement.dto";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { Announcement } from "./entities/announcement.entity";
import { GetAnnouncementsDto } from "./dto/get-announcements.dto";
import { ToggleCheckedAnnouncementDto } from "./dto/toggle-checked-announcement.dto";
import { Roles } from "../auth/decorators/roles-auth.decorator";
import { RolesGuard } from "../auth/guards/roles.guard";
import { GetFavoritiesAnnouncementsDto } from "./dto/get-favorities-announcements.dto";
import { AddToFavoritiesDto } from "./dto/add-to-favorities.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { GetFavoritiesAnnouncements } from "./swagger/api-response/get-favorities-announcements.type";
import {
  MatchFavoriteAnnouncementErrorResponse,
  MatchFavoriteAnnouncementOkResponse,
} from "./swagger/api-response/match-favorite-announcement.type";
import { AddToFavoritiesAnnouncementsErrorResponse } from "./swagger/api-response/add-to-favorite-announcements.type";
import { FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { randomUUID } from "crypto";
import { CreateAnnouncementsApiOkResponse } from "./swagger/api-response/create-announcements.type";
import { CreateOneAnnouncementDto } from "./dto/create-one-announcement.dto";

const storage = {
  storage: diskStorage({
    destination: "./src/static/uploads",
    filename: (req, file, cb) => {
      const uuid = randomUUID();
      const fileExt = file.originalname.split(".").pop();
      const filename = `${uuid}.${fileExt}`;

      cb(null, filename);
    },
  }),
};

@Controller("announcements")
@ApiTags("Объявления")
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  @ApiOperation({ summary: "Создать объявления из парсера" })
  @ApiCreatedResponse({
    type: CreateAnnouncementsApiOkResponse,
    description: "Объявления успешно добавлены",
  })
  @ApiBadRequestResponse({
    description: "Недействительный запрос",
  })
  @ApiBody({ type: [CreateAnnouncementDto] })
  @Post("add_v2")
  create_v2(@Body() createAnnouncementDto: CreateAnnouncementDto[]) {
    return this.announcementService.create_v2(createAnnouncementDto);
  }

  @ApiOperation({ summary: "Создать объявления из парсера" })
  @ApiCreatedResponse({
    type: CreateAnnouncementsApiOkResponse,
    description: "Объявления успешно добавлены",
  })
  @ApiBadRequestResponse({
    description: "Недействительный запрос",
  })
  @ApiBody({ type: [CreateAnnouncementDto] })
  @Post("add")
  create(@Body() createAnnouncementDto: CreateAnnouncementDto[]) {
    return this.announcementService.create(createAnnouncementDto);
  }

  @ApiOperation({ summary: "Создать объявление" })
  @ApiCreatedResponse({
    type: Announcement,
    description: "Объявление успешно создано",
  })
  @ApiForbiddenResponse({
    description: "Недостаточно прав",
  })
  @ApiBearerAuth()
  @ApiConsumes("multipart/form-data")
  @Roles("ADMIN", "ADS_EDITOR")
  @UseGuards(RolesGuard)
  @Post("add_one")
  @UseInterceptors(FilesInterceptor("photos", 10, storage))
  createOne(
    @UploadedFiles() photos: Express.Multer.File[],
    @Body() createAnnouncementDto: CreateOneAnnouncementDto
  ) {
    return this.announcementService.createOne(photos, createAnnouncementDto);
  }

  @ApiOperation({ summary: "Получить объявления" })
  @ApiOkResponse({
    type: [Announcement],
    description: "Возвращает массив объявлений",
  })
  @Get()
  findAll(@Query() queryParams: GetAnnouncementsDto) {
    return this.announcementService.findAll(queryParams);
  }

  @ApiOperation({ summary: "Получить кол-во объявлений" })
  @ApiOkResponse({ description: "Возвращает общее количество объявлений" })
  @Get("count")
  getAnnouncementsCount() {
    return this.announcementService.getAnnouncementsCount();
  }

  @ApiOperation({ summary: "Получить избранные объявления" })
  @ApiOkResponse({
    type: [Announcement],
    description: "Возвращает массив избранных объявлений",
  })
  @ApiBadRequestResponse({
    description: "Пользователь не найден",
    type: GetFavoritiesAnnouncements,
  })
  @ApiForbiddenResponse({
    description: "Недостаточно прав",
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get("/favorities")
  getFavoritiesAnnouncements(
    @Query() queryParams: GetFavoritiesAnnouncementsDto
  ) {
    return this.announcementService.getFavoritiesAnnouncements(queryParams);
  }

  @ApiOperation({ summary: "Проверка объявления на соответствие в избранном" })
  @ApiOkResponse({
    type: MatchFavoriteAnnouncementOkResponse,
    description: "Объявление есть в избранных пользователя",
  })
  @ApiBadRequestResponse({
    description: "Объявление не найдено",
    type: MatchFavoriteAnnouncementErrorResponse,
  })
  @ApiForbiddenResponse({
    description: "Недостаточно прав",
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get("/favorities/match")
  matchFavoriteAnnouncement(@Query() queryParams: AddToFavoritiesDto) {
    return this.announcementService.matchFavoriteAnnouncement(queryParams);
  }

  @ApiOperation({ summary: "Добавить объявление в избранное" })
  @ApiCreatedResponse({
    type: AddToFavoritiesDto,
    description: "Объявление успешно добавлено в избранное",
  })
  @ApiBadRequestResponse({
    description: "Пользователь или объявление не найдены",
    type: AddToFavoritiesAnnouncementsErrorResponse,
  })
  @ApiForbiddenResponse({
    description: "Недостаточно прав",
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post("/favorities/add")
  addToFavoritiesAnnouncements(@Body() addToFavoriteDto: AddToFavoritiesDto) {
    return this.announcementService.addToFavoritiesAnnouncements(
      addToFavoriteDto
    );
  }

  @ApiOperation({ summary: "Удалить объявление из избранного" })
  @ApiOkResponse({
    type: AddToFavoritiesDto,
    description: "Объявление успешно удалено из избранного",
  })
  @ApiBadRequestResponse({
    description: "Пользователь или объявление не найдены",
    type: AddToFavoritiesAnnouncementsErrorResponse,
  })
  @ApiForbiddenResponse({
    description: "Недостаточно прав",
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete("/favorities/remove")
  removeFromFavoritiesAnnouncements(
    @Body() removeFromFavoriteDto: AddToFavoritiesDto
  ) {
    return this.announcementService.removeFromFavoritiesAnnouncements(
      removeFromFavoriteDto
    );
  }

  @ApiOperation({ summary: "Получить объявление по id" })
  @ApiOkResponse({
    type: Announcement,
    description: "Возвращает объявление по его идентификатору",
  })
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.announcementService.findOne(+id);
  }

  @ApiOperation({ summary: "Обновить объявление" })
  @ApiOkResponse({
    type: Announcement,
    description: "Объявление успешно обновлено",
  })
  @ApiForbiddenResponse({
    description: "Недостаточно прав",
  })
  @ApiConsumes("multipart/form-data")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  @UseInterceptors(FilesInterceptor("photos", 10, storage))
  update(
    @UploadedFiles() photos: Express.Multer.File[],
    @Param("id") id: number,
    @Body() updateAnnouncementDto: UpdateAnnouncementDto,
    @Query() isRemoveInitImages: string
  ) {
    return this.announcementService.update(
      id,
      updateAnnouncementDto,
      isRemoveInitImages,
      photos
    );
  }

  @ApiOperation({ summary: "Удалить объявление" })
  @ApiOkResponse({
    type: Announcement,
    description: "Объявление успешно удалено",
  })
  @ApiForbiddenResponse({
    description: "Недостаточно прав",
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.announcementService.remove(+id);
  }

  @ApiOperation({ summary: "Изменить флаг проверки объявления" })
  @ApiOkResponse({
    description: "Флаг успешно изменен",
    type: ToggleCheckedAnnouncementDto,
  })
  @ApiForbiddenResponse({
    description: "Недостаточно прав",
  })
  @ApiBearerAuth()
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @Patch(":id/checked")
  toggleChecked(
    @Body() toggleCheckedAnnouncementDto: ToggleCheckedAnnouncementDto
  ) {
    return this.announcementService.toggleChecked(toggleCheckedAnnouncementDto);
  }
}
