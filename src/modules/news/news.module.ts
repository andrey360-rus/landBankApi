import { Module } from "@nestjs/common";
import { NewsController } from "./news.controller";
import { NewsService } from "./news.service";
import { News } from "./entities/news.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { DatesModule } from "src/utils/dates/dates.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([News]),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || "SECRET",
      signOptions: {
        expiresIn: "24h",
      },
    }),
    DatesModule,
  ],
  controllers: [NewsController],
  providers: [NewsService],
})
export class NewsModule {}
