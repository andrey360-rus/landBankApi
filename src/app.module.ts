import { Module } from "@nestjs/common";
import { AnnouncementModule } from "./modules/announcement/announcement.module";
import { DatabaseModule } from "./common/config/database.module";
import { UsersModule } from "./modules/users/users.module";
import { RolesModule } from "./modules/roles/roles.module";
import { AuthModule } from "./modules/auth/auth.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    DatabaseModule,
    AnnouncementModule,
    UsersModule,
    RolesModule,
    AuthModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "src", "static", "uploads"),
    }),
    ConfigModule.forRoot(),
  ],
})
export class AppModule {}
