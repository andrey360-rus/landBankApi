import { Module } from "@nestjs/common";
import { AnnouncementModule } from "./modules/announcement/announcement.module";
import { DatabaseModule } from "./common/config/database.module";
import { UsersModule } from "./modules/users/users.module";
import { RolesModule } from "./modules/roles/roles.module";
import { AuthModule } from "./modules/auth/auth.module";
import { NotesModule } from "./modules/notes/notes.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { MailerModule } from "@nestjs-modules/mailer";
import { ConfigModule } from "@nestjs/config";

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
      serveRoot: "/images",
    }),
    MailerModule.forRoot({
      transport: {
        host: "smtp.yandex.ru",
        port: 465,
        ignoreTLS: true,
        secure: true,
        auth: {
          user: process.env.MAILDEV_INCOMING_USER,
          pass: process.env.MAILDEV_INCOMING_PASS,
        },
      },
    }),
    ConfigModule.forRoot(),
  ],
})
export class AppModule {}
