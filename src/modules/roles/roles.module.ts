import { Module } from "@nestjs/common";
import { RolesController } from "./roles.controller";
import { RolesService } from "./roles.service";
import { Role } from "./entities/roles.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../users/entities/users.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Role, User])],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
