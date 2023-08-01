import { Module } from "@nestjs/common";
import { AnnouncementModule } from "./modules/announcement/announcement.module";
import { DatabaseModule } from "./common/config/database.module";
import { UsersModule } from "./modules/users/users.module";
import { RolesModule } from "./modules/roles/roles.module";
import { AuthModule } from "./modules/auth/auth.module";

@Module({
  imports: [
    DatabaseModule,
    AnnouncementModule,
    UsersModule,
    RolesModule,
    AuthModule,
  ],
})
export class AppModule {}
