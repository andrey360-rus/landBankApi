import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { User } from "./entities/users.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { RolesService } from "../roles/roles.service";
import { AddRoleDto } from "./dto/add-role.dto";
import { RolesEnum } from "../roles/roles.enum";
import { SetStatusUserDto } from "./dto/set-status-user.dto";
import { FindAllUsersDto } from "./dto/find-all-users.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private roleService: RolesService
  ) {}

  async create(data: CreateUserDto) {
    const { landUserStatus } = data;
    const user = this.usersRepository.create({
      ...data,
      isLandUserObtainStatus: landUserStatus,
    });

    const role = await this.roleService.findRoleByValue(RolesEnum.USER);

    const userWithRoles = { ...user, roles: [...[role]] };

    await this.usersRepository.save(userWithRoles);

    return userWithRoles;
  }

  async findAll(queryParams: FindAllUsersDto) {
    const { isLandUserObtainStatus } = queryParams;

    const [listUsers, totalCount] = await this.usersRepository.findAndCount({
      select: {
        id: true,
        email: true,
        isActive: true,
        isLandUserObtainStatus: true,
      },
      relations: ["roles"],
      where: {
        ...(isLandUserObtainStatus && {
          isLandUserObtainStatus,
        }),
      },
    });

    return { listUsers, totalCount };
  }

  async findById(id: number) {
    const user = await this.usersRepository.findOne({
      select: {
        id: true,
        email: true,
        isActive: true,
        isLandUserObtainStatus: true,
      },
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
      const newUserRoles = user.roles.concat(role);

      const userWithNewRoles = { ...user, roles: newUserRoles };

      await this.usersRepository.save(userWithNewRoles);

      return data;
    }

    throw new HttpException(
      "Пользователь или роль не найдены",
      HttpStatus.NOT_FOUND
    );
  }

  async setStatusUser(data: SetStatusUserDto) {
    const { id, isActive } = data;

    await this.usersRepository.update({ id }, { isActive });

    return { id, isActive };
  }

  async checkActiveUser(userFromReq: User) {
    const { id } = userFromReq;

    const user = await this.findById(id);

    return { isActiveStatus: user.isActive };
  }

  async setLandUserRole(userId: number) {
    await this.usersRepository.update(
      { id: userId },
      {
        isLandUserObtainStatus: false,
      }
    );

    await this.addRole({ userId, value: RolesEnum.LAND_USER });
  }
}
