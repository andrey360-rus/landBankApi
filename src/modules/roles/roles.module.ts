import { Module } from "@nestjs/common";
import { RolesController } from "./roles.controller";
import { RolesService } from "./roles.service";
import { Role } from "./entities/roles.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../users/entities/users.entity";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, User]),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || "SECRET",
      signOptions: {
        expiresIn: "24h",
      },
    }),
  ],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
