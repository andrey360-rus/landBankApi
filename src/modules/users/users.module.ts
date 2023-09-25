import { Module, forwardRef } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/users.entity";
import { Role } from "../roles/entities/roles.entity";
import { RolesModule } from "../roles/roles.module";
import { AuthModule } from "../auth/auth.module";
import { Note } from "../notes/entities/notes.entity";
import { NotesModule } from "../notes/notes.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Note]),
    RolesModule,
    NotesModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
