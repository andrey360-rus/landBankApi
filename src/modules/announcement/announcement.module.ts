import { Module } from "@nestjs/common";
import { AnnouncementService } from "./announcement.service";
import { AnnouncementController } from "./announcement.controller";
import { Announcement } from "./entities/announcement.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { DatesModule } from "src/utils/dates/dates.module";
import { User } from "../users/entities/users.entity";
import { UsersModule } from "../users/users.module";
import { Note } from "../notes/entities/notes.entity";
import { NotesModule } from "../notes/notes.module";
import { Region } from "./entities/region.entity";
import { RegionIntervalPriceCategory } from "./entities/region-interval-price-category.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Announcement,
      Region,
      RegionIntervalPriceCategory,
      User,
      Note,
    ]),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || "SECRET",
      signOptions: {
        expiresIn: "24h",
      },
    }),
    DatesModule,
    UsersModule,
    NotesModule,
  ],
  controllers: [AnnouncementController],
  providers: [AnnouncementService],
})
export class AnnouncementModule {}
