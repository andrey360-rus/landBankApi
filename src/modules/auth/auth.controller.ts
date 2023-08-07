import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { UserFromReq } from "./decorators/user.decorator";
import { User } from "../users/entities/users.entity";

@ApiTags("Авторизация")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: "Авторизация пользователя" })
  @ApiResponse({ status: 200 })
  @Post("/login")
  login(@Body() userDto: CreateUserDto) {
    return this.authService.login(userDto);
  }

  @ApiOperation({ summary: "Регистрация пользователя" })
  @ApiResponse({
    status: 200,
  })
  @Post("/registration")
  registration(@Body() userDto: CreateUserDto) {
    return this.authService.registration(userDto);
  }

  @ApiOperation({ summary: "Проверка пользователя" })
  @ApiResponse({
    status: 200,
  })
  @UseGuards(JwtAuthGuard)
  @Get("/check")
  check(@UserFromReq() userFromReq: User) {
    return this.authService.check(userFromReq);
  }
}
