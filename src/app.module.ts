import { Module } from "@nestjs/common";
import {AnnouncementModule} from "./modules/announcement/announcement.module";
import {DatabaseModule} from "./common/config/database.module";

@Module({
  imports: [
      DatabaseModule,
      AnnouncementModule
  ]
})
export class AppModule {
}


