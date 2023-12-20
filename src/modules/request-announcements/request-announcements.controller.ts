import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ClassSerializerInterceptor,
  UseInterceptors,
  Query,
} from "@nestjs/common";
import { RequestAnnouncementsService } from "./request-announcements.service";
import { CreateRequestAnnouncementDto } from "./dto/create-request-announcement.dto";
import { UpdateRequestAnnouncementDto } from "./dto/update-request-announcement.dto";
import { Roles } from "../auth/decorators/roles-auth.decorator";
import { RolesGuard } from "../auth/guards/roles.guard";
import { RolesEnum } from "../roles/roles.enum";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { GetRequestAnnouncementDto } from "./dto/get-request-announcement.dto";
import { RequestAnnouncement } from "./entities/request-announcement.entity";
import { FindAllRequestAnnouncementsApiOkResponse } from "./swagger/api-response/find-all-request-announcements";

@UseInterceptors(ClassSerializerInterceptor)
@Controller("request_announcements")
@ApiTags("Объявления-запросы покупки зу")
export class RequestAnnouncementsController {
  constructor(
    private readonly requestAnnouncementsService: RequestAnnouncementsService
  ) {}

  @ApiOperation({ summary: "Создать запрос" })
  @ApiCreatedResponse({
    type: RequestAnnouncement,
    description: "Запрос успешно создан",
  })
  @ApiForbiddenResponse({
    description: "Недостаточно прав",
  })
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(RolesEnum.ADMIN, RolesEnum.LAND_USER)
  @Post()
  create(@Body() createRequestAnnouncementDto: CreateRequestAnnouncementDto) {
    return this.requestAnnouncementsService.create(
      createRequestAnnouncementDto
    );
  }

  @ApiOperation({ summary: "Получить запросы" })
  @ApiOkResponse({
    type: FindAllRequestAnnouncementsApiOkResponse,
    description: "Возвращает массив запросов и общее количество",
  })
  @ApiForbiddenResponse({
    description: "Недостаточно прав",
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() queryParams: GetRequestAnnouncementDto) {
    return this.requestAnnouncementsService.findAll(queryParams);
  }

  @ApiOperation({ summary: "Получить запрос по идентификатору" })
  @ApiOkResponse({
    type: RequestAnnouncement,
    description: "Возвращает запрос по его идентификатору",
  })
  @ApiForbiddenResponse({
    description: "Недостаточно прав",
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.requestAnnouncementsService.findOne(+id);
  }

  @ApiOperation({ summary: "Обновить запрос" })
  @ApiOkResponse({
    type: RequestAnnouncement,
    description: "Запрос успешно обновлен",
  })
  @ApiForbiddenResponse({
    description: "Недостаточно прав",
  })
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(RolesEnum.ADMIN, RolesEnum.LAND_USER)
  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateRequestAnnouncementDto: UpdateRequestAnnouncementDto
  ) {
    return this.requestAnnouncementsService.update(
      +id,
      updateRequestAnnouncementDto
    );
  }

  @ApiOperation({ summary: "Удалить запрос" })
  @ApiOkResponse({
    type: RequestAnnouncement,
    description: "Запрос успешно удален",
  })
  @ApiForbiddenResponse({
    description: "Недостаточно прав",
  })
  @UseGuards(RolesGuard)
  @Roles(RolesEnum.ADMIN, RolesEnum.LAND_USER)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.requestAnnouncementsService.remove(+id);
  }
}
