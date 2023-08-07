import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { RolesService } from "./roles.service";
import { CreateRoleDto } from "./dto/create-role.dto";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { Role } from "./entities/roles.entity";
import { Roles } from "../auth/decorators/roles-auth.decorator";
import { RolesGuard } from "../auth/guards/roles.guard";

@ApiTags("Роли пользователя")
@ApiBearerAuth()
@Controller("roles")
export class RolesController {
  constructor(private readonly roleService: RolesService) {}

  @ApiOperation({ summary: "Создать роль" })
  @ApiCreatedResponse({
    type: Role,
    description: "Роль успешно создана",
  })
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @Post("add")
  create(@Body() roleDto: CreateRoleDto) {
    return this.roleService.create(roleDto);
  }

  @ApiOperation({ summary: "Получить все роли" })
  @ApiOkResponse({ type: [Role], description: "Возвращает все роли" })
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @Get()
  findRoles() {
    return this.roleService.findAll();
  }

  @ApiOperation({ summary: "Получить роль по значению" })
  @ApiOkResponse({
    type: Role,
    description: "Возвращет роль по ее значению",
  })
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @Get("/:value")
  findRoleByValue(@Param("value") value: string) {
    return this.roleService.findRoleByValue(value);
  }
}
