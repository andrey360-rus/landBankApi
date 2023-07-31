import { Injectable } from "@nestjs/common";
import { CreateRoleDto } from "./dto/create-role.dto";
import { InjectConnection } from "@nestjs/typeorm";
import { Connection } from "typeorm";
import { Role } from "./entities/roles.entity";

@Injectable()
export class RolesService {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async create(data: CreateRoleDto) {
    const role = await this.connection.manager.save(Role, data);

    return role;
  }

  async findRoleByValue(value: string) {
    const role = await this.connection.manager.findOne(Role, {
      where: { value },
    });

    return role;
  }

  //   async findRoles() {
  //     const roles = await this.connection.manager.find(Role);

  //     return roles;
  //   }
}
