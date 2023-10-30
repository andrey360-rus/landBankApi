import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { User } from "./entities/users.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { RolesService } from "../roles/roles.service";
import { AddRoleDto } from "./dto/add-role.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private roleService: RolesService
  ) {}

  async create(data: CreateUserDto) {
    const user = this.usersRepository.create(data);

    const role = await this.roleService.findRoleByValue("USER");

    const userWithRoles = { ...user, roles: [...[role]] };

    await this.usersRepository.save(userWithRoles);

    return userWithRoles;
  }

  async findAll() {
    const [listUsers, totalCount] = await this.usersRepository.findAndCount({
      relations: ["roles"],
    });

    return { listUsers, totalCount };
  }

  async findById(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ["favoritiesAnnouncements"],
    });

    return user;
  }

  async getUserByEmail(email: string) {
    const user = await this.usersRepository.findOne({
      relations: ["roles"],
      where: { email },
    });

    return user;
  }

  async addRole(data: AddRoleDto) {
    const { value, userId } = data;
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ["roles"],
    });
    const role = await this.roleService.findRoleByValue(value);

    if (role && user) {
      const newUserRoles = user.roles.concat(role); // spread не работает как на 22 строке, будет перезаписывать текущий массив ролей

      const userWithNewRoles = { ...user, roles: newUserRoles };

      await this.usersRepository.save(userWithNewRoles);

      return data;
    }

    throw new HttpException(
      "Пользователь или роль не найдены",
      HttpStatus.NOT_FOUND
    );
  }
}
