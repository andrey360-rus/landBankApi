import { Module } from "@nestjs/common";
import { AnnouncementService } from "./announcement.service";
import { AnnouncementController } from "./announcement.controller";
import { Announcement } from "./entities/announcement.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { DatesModule } from "src/utils/dates/dates.module";
import { User } from "../users/entities/users.entity";
import { UsersModule } from "../users/users.module";
import { GetCoordsByAddressModule } from "src/utils/get-coords-by-address/get-coords-by-address.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Announcement, User]),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || "SECRET",
      signOptions: {
        expiresIn: "24h",
      },
    }),
    DatesModule,
    UsersModule,
    GetCoordsByAddressModule,
  ],
  controllers: [AnnouncementController],
  providers: [AnnouncementService],
})

export class AnnouncementModule {}
