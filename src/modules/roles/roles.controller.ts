import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { RolesService } from "./roles.service";
import { CreateRoleDto } from "./dto/create-role.dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Role } from "./entities/roles.entity";

@ApiTags("Роли пользователя")
@Controller("roles")
export class RolesController {
  constructor(private readonly roleService: RolesService) {}

  @ApiOperation({ summary: "Создать роль" })
  @ApiResponse({ status: 201, type: Role })
  @Post("add")
  create(@Body() roleDto: CreateRoleDto) {
    return this.roleService.create(roleDto);
  }

  @ApiOperation({ summary: "Получить все роли" })
  @ApiResponse({ status: 200, type: [Role] })
  @Get()
  findRoles() {
    return this.roleService.findAll();
  }

  @ApiOperation({ summary: "Получить роль по значению" })
  @ApiResponse({ status: 200, type: Role })
  @Get("/:value")
  findRoleByValue(@Param("value") value: string) {
    return this.roleService.findRoleByValue(value);
  }
}
