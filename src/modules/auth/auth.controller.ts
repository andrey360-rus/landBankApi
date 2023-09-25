import {
  Body,
  Controller,
  Get,
  Patch,
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
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { UserFromReq } from "./decorators/user.decorator";
import { User } from "../users/entities/users.entity";
import { LoginOkResponse } from "./swagger/api-response/login-response.type";
import {
  RegistrationBadRequestErrorResponse,
  RegistrationOkResponse,
} from "./swagger/api-response/registartion-response.type";
import {
  CheckErrorResponse,
  CheckOkResponse,
} from "./swagger/api-response/check-response.type";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { ValidationPipe } from "src/pipes/validation.pipe";
import { ChangePasswordDto } from "./dto/change-password.dto";

@ApiTags("Авторизация")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: "Авторизация пользователя" })
  @ApiOkResponse({ type: LoginOkResponse, description: "Авторизация успешна" })
  @ApiUnauthorizedResponse({
    description: "Неправильно указана почта или пароль",
  })
  @Post("/login")
  login(@Body() userDto: CreateUserDto) {
    return this.authService.login(userDto);
  }

  @ApiOperation({ summary: "Регистрация пользователя" })
  @ApiCreatedResponse({
    type: RegistrationOkResponse,
    description: "Регистрация успешна",
  })
  @ApiBadRequestResponse({
    type: RegistrationBadRequestErrorResponse,
    description: "Некорректная почта или пароль",
  })
  @Post("/registration")
  registration(@Body() userDto: CreateUserDto) {
    return this.authService.registration(userDto);
  }

  @ApiOperation({ summary: "Проверка пользователя" })
  @ApiOkResponse({ type: CheckOkResponse, description: "Проверка успешна" })
  @ApiUnauthorizedResponse({
    description: "Пользователь не авторизован",
    type: CheckErrorResponse,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get("/check")
  check(@UserFromReq() userFromReq: User) {
    return this.authService.check(userFromReq);
  }

  @ApiOperation({ summary: "Отправка письма с инструкцией для сброса пароля" })
  @UsePipes(ValidationPipe)
  @Post("/forgotPassword")
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @ApiOperation({ summary: "Смена пароля пользователя" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @Patch("/changePassword")
  async changePassword(
    @UserFromReq() userFromReq: User,
    @Body() changePasswordDto: ChangePasswordDto
  ) {
    return this.authService.changePassword(userFromReq, changePasswordDto);
  }
}
