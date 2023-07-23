import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from "@nestjs/common";
import { AnnouncementService } from "./announcement.service";
import { CreateAnnouncementDto } from "./dto/create-announcement.dto";
import { UpdateAnnouncementDto } from "./dto/update-announcement.dto";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { Announcement } from "./entities/announcement.entity";
import { GetAnnouncementsDto } from "./dto/get-announcements.dto";
import { string } from "@hapi/joi";

@Controller("announcements")
@ApiTags("announcements")
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  @Post("add")
  @ApiResponse({ status: 200, type: string })
  create(@Body() createAnnouncementDto: Array<CreateAnnouncementDto>) {
    return this.announcementService.create(createAnnouncementDto);
  }

  @Get()
  @ApiResponse({ status: 200, type: [Announcement] })
  findAll(@Query() queryParams: GetAnnouncementsDto) {
    return this.announcementService.findAll(queryParams);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.announcementService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateAnnouncementDto: UpdateAnnouncementDto
  ) {
    return this.announcementService.update(+id, updateAnnouncementDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.announcementService.remove(+id);
  }
}
