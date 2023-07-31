import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateUserDto } from "./dto/create-user.dto";
import { UsersService } from "./users.service";
import { User } from "./entities/users.entity";

@Controller("users")
@ApiTags("Пользователи")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("add")
  @ApiResponse({ status: 201, type: User })
  create(@Body() userDto: CreateUserDto) {
    return this.usersService.create(userDto);
  }

  @Get()
  @ApiResponse({ status: 200, type: [User] })
  findAll() {
    return this.usersService.findAll();
  }
}
