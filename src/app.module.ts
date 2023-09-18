import { Module } from "@nestjs/common";
import { AnnouncementModule } from "./modules/announcement/announcement.module";
import { DatabaseModule } from "./common/config/database.module";
import { UsersModule } from "./modules/users/users.module";
import { RolesModule } from "./modules/roles/roles.module";
import { AuthModule } from "./modules/auth/auth.module";
import { NotesModule } from "./modules/notes/notes.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";

@Module({
  imports: [
    DatabaseModule,
    AnnouncementModule,
    UsersModule,
    RolesModule,
    AuthModule,
    NotesModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "src", "static", "uploads"),
    }),
  ],
})
export class AppModule {}
