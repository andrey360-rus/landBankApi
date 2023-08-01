import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateUserDto } from "./dto/create-user.dto";
import { UsersService } from "./users.service";
import { User } from "./entities/users.entity";
import { Roles } from "../auth/decorators/roles-auth.decorator";
import { RolesGuard } from "../auth/guards/roles.guard";
import { AddRoleDto } from "./dto/add-role.dto";
import { ValidationPipe } from "src/pipes/validation.pipe";

@Controller("users")
@ApiTags("Пользователи")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: "Создать пользователя" })
  @ApiResponse({ status: 201, type: User })
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @UsePipes(ValidationPipe)
  @Post("add")
  create(@Body() userDto: CreateUserDto) {
    return this.usersService.create(userDto);
  }

  @ApiOperation({ summary: "Получить всех пользователей" })
  @ApiResponse({ status: 200, type: [User] })
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: "Добавить роль пользователю" })
  @ApiResponse({ status: 201 })
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @Post("/add_role")
  addRole(@Body() roleDto: AddRoleDto) {
    return this.usersService.addRole(roleDto);
  }
}
