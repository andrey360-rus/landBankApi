import { Injectable } from "@nestjs/common";
import { User } from "./entities/users.entity";
import { InjectConnection, InjectRepository } from "@nestjs/typeorm";
import { Connection, Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { RolesService } from "../roles/roles.service";

@Injectable()
export class UsersService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    private roleService: RolesService
  ) {}

  async create(data: CreateUserDto) {
    const user = this.connection.manager.create(User, data);

    const role = await this.roleService.findRoleByValue("ADS_EDITOR");

    const userWithRoles = { ...user, roles: [role] };

    await this.connection.manager.save(User, userWithRoles);

    return userWithRoles;
  }

  async findAll() {
    const [listUsers, totalCount] = await this.connection.manager.findAndCount(
      User,
      { relations: ["roles"] }
    );

    return { listUsers, totalCount };
  }
}
