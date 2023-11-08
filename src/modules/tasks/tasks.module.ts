import { Module } from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Announcement } from "../announcement/entities/announcement.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Announcement])],
  providers: [TasksService],
})
export class TasksModule {}
