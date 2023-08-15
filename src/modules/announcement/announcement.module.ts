import { Module } from "@nestjs/common";
import { AnnouncementService } from "./announcement.service";
import { AnnouncementController } from "./announcement.controller";
import { Announcement } from "./entities/announcement.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    TypeOrmModule.forFeature([Announcement]),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || "SECRET",
      signOptions: {
        expiresIn: "24h",
      },
    }),
  ],
  controllers: [AnnouncementController],
  providers: [AnnouncementService],
})
export class AnnouncementModule {}
