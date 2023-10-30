import { Module } from "@nestjs/common";
import { NotesController } from "./notes.controller";
import { NotesService } from "./notes.service";
import { JwtModule } from "@nestjs/jwt";
import { DatesModule } from "src/utils/dates/dates.module";
import { Note } from "./entities/notes.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [
    TypeOrmModule.forFeature([Note]),
    DatesModule,
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || "SECRET",
      signOptions: {
        expiresIn: "24h",
      },
    }),
  ],
  controllers: [NotesController],
  providers: [NotesService],
})
export class NotesModule {}
