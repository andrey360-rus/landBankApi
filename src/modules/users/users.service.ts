import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { User } from "./entities/users.entity";
import { InjectConnection } from "@nestjs/typeorm";
import { Connection } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { RolesService } from "../roles/roles.service";
import { AddRoleDto } from "./dto/add-role.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    private roleService: RolesService
  ) {}

  async create(data: CreateUserDto) {
    const user = this.connection.manager.create(User, data);

    const role = await this.roleService.findRoleByValue("USER");

    const userWithRoles = { ...user, roles: [...[role]] };

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

  async getUserByEmail(email: string) {
    const user = await this.connection.manager.findOne(User, {
      relations: ["roles"],
      where: { email },
    });

    return user;
  }

  async addRole(data: AddRoleDto) {
    const { value, userId } = data;
    const user = await this.connection.manager.findOne(User, {
      where: { id: userId },
      relations: ["roles"],
    });
    const role = await this.roleService.findRoleByValue(value);

    if (role && user) {
      const newUserRoles = user.roles.concat(role); // spread не работает как на 22 строке, будет перезаписывать текущий массив ролей

      const userWithNewRoles = { ...user, roles: newUserRoles };

      await this.connection.manager.save(User, userWithNewRoles);

      return data;
    }

    throw new HttpException(
      "Пользователь или роль не найдены",
      HttpStatus.NOT_FOUND
    );
  }
}
