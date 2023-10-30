import { Injectable } from "@nestjs/common";
import { CreateRoleDto } from "./dto/create-role.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Role } from "./entities/roles.entity";

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>
  ) {}

  async create(data: CreateRoleDto) {
    const role = await this.rolesRepository.save(data);

    return role;
  }

  async findAll() {
    const roles = await this.rolesRepository.find();

    return roles;
  }

  async findRoleByValue(value: string) {
    const role = await this.rolesRepository.findOne({
      where: { value },
    });

    return role;
  }
}
