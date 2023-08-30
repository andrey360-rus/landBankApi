import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { CreateUserDto } from "./dto/create-user.dto";
import { UsersService } from "./users.service";
import { User } from "./entities/users.entity";
import { Roles } from "../auth/decorators/roles-auth.decorator";
import { RolesGuard } from "../auth/guards/roles.guard";
import { AddRoleDto } from "./dto/add-role.dto";
import { ValidationPipe } from "src/pipes/validation.pipe";
import { FindAllOkResponse } from "./swagger/api-response/find-all-response.type";
import { AddRoleErrorResponse } from "./swagger/api-response/add-role-response.type";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@ApiTags("Пользователи")
@ApiBearerAuth()
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: "Создать пользователя" })
  @ApiOkResponse({ type: User, description: "Пользователь успешно создан" })
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @UsePipes(ValidationPipe)
  @Post("add")
  create(@Body() userDto: CreateUserDto) {
    return this.usersService.create(userDto);
  }

  @ApiOperation({ summary: "Получить всех пользователей" })
  @ApiOkResponse({
    type: FindAllOkResponse,
    description: "Возвращает список пользователей",
  })
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: "Получить пользователя по id" })
  @ApiOkResponse({
    type: User,
    description: "Возвращает пользователя с выбранным id",
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(":id")
  findById(@Param("id") id: number) {
    return this.usersService.findById(id);
  }

  @ApiOperation({ summary: "Добавить роль пользователю" })
  @ApiCreatedResponse({
    description: "Роль успешно добавлена пользователю",
    type: AddRoleDto,
  })
  @ApiBadRequestResponse({
    description: "Пользователь или роль не найдены",
    type: AddRoleErrorResponse,
  })
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @Post("/add_role")
  addRole(@Body() roleDto: AddRoleDto) {
    return this.usersService.addRole(roleDto);
  }
}
