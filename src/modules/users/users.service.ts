import { Injectable } from "@nestjs/common";
import { User } from "./entities/users.entity";
import { InjectConnection } from "@nestjs/typeorm";
import { Connection } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UsersService {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async create(data: CreateUserDto) {
    const user = await this.connection.manager.save(User, data);

    return user;
  }

  async findAll() {
    const [listUsers, totalCount] = await this.connection.manager.findAndCount(
      User
    );

    return { listUsers, totalCount };
  }
}
