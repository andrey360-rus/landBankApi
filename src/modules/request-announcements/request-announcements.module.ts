import { Module } from "@nestjs/common";
import { RequestAnnouncementsService } from "./request-announcements.service";
import { RequestAnnouncementsController } from "./request-announcements.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../users/entities/users.entity";
import { JwtModule } from "@nestjs/jwt";
import { RequestAnnouncement } from "./entities/request-announcement.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([RequestAnnouncement, User]),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || "SECRET",
      signOptions: {
        expiresIn: "24h",
      },
    }),
  ],
  controllers: [RequestAnnouncementsController],
  providers: [RequestAnnouncementsService],
})
export class RequestAnnouncementsModule {}
