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
} from "@nestjs/common";
import { AnnouncementService } from "./announcement.service";
import { CreateAnnouncementDto } from "./dto/create-announcement.dto";
import { UpdateAnnouncementDto } from "./dto/update-announcement.dto";
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { Announcement } from "./entities/announcement.entity";
import { GetAnnouncementsDto } from "./dto/get-announcements.dto";
import { boolean } from "@hapi/joi";
import { ToggleCheckedAnnouncementDto } from "./dto/toggle-checked-announcement.dto";
import { Roles } from "../auth/decorators/roles-auth.decorator";
import { RolesGuard } from "../auth/guards/roles.guard";

@Controller("announcements")
@ApiTags("Объявления")
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  @ApiOperation({ summary: "Создать объявление" })
  @ApiResponse({ status: 201, type: Announcement })
  @ApiBearerAuth()
  @Post("add")
  create(@Body() createAnnouncementDto: Array<CreateAnnouncementDto>) {
    return this.announcementService.create(createAnnouncementDto);
  }

  @ApiOperation({ summary: "Получить объявления" })
  @ApiResponse({ status: 200, type: [Announcement] })
  @Get()
  findAll(@Query() queryParams: GetAnnouncementsDto) {
    return this.announcementService.findAll(queryParams);
  }

  @ApiOperation({ summary: "Получить кол-во объявлений" })
  @ApiResponse({ status: 200 })
  @Get("count")
  getAnnouncementsCount() {
    return this.announcementService.getAnnouncementsCount();
  }

  @ApiOperation({ summary: "Получить объявление по id" })
  @ApiResponse({ status: 200, type: Announcement })
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.announcementService.findOne(+id);
  }

  @ApiOperation({ summary: "Обновить объявление" })
  @ApiResponse({ status: 200, type: Announcement })
  @ApiBearerAuth()
  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateAnnouncementDto: UpdateAnnouncementDto
  ) {
    return this.announcementService.update(+id, updateAnnouncementDto);
  }

  @ApiOperation({ summary: "Удалить объявление" })
  @ApiResponse({ status: 200, type: Announcement })
  @ApiBearerAuth()
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
