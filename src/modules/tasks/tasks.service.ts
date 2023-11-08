import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Announcement } from "../announcement/entities/announcement.entity";

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Announcement)
    private announcementsRepository: Repository<Announcement>
  ) {}

  @Cron("30 2 1,15 * *")
  async checkedTimeVerificationAds() {
    const announcements = await this.announcementsRepository.find({
      where: {
        is_checked: true,
      },
    });

    const twoWeeksAgo = new Date(new Date().setDate(new Date().getDate() - 14));

    for (const announcement of announcements) {
      if (announcement.date_checked > twoWeeksAgo) {
        await this.announcementsRepository.update(
          { id: announcement.id },
          { is_checked: false, date_checked: null }
        );
      }
    }
  }
}
