import { Module } from "@nestjs/common";
import { AnnouncementModule } from "./modules/announcement/announcement.module";
import { DatabaseModule } from "./common/config/database.module";
import { UsersModule } from "./modules/users/users.module";
import { RolesModule } from "./modules/roles/roles.module";
import { AuthModule } from "./modules/auth/auth.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { MailerModule } from "@nestjs-modules/mailer";

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
  ],
})
export class AppModule {}
