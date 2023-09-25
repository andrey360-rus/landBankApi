import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { User } from "../users/entities/users.entity";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { MailerService } from "@nestjs-modules/mailer";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { InjectConnection } from "@nestjs/typeorm";
import { Connection } from "typeorm";

@Injectable()
export class AuthService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    private userService: UsersService,
    private jwtService: JwtService,
    private readonly mailerService: MailerService
  ) {}

  async login(data: CreateUserDto) {
    const user = await this.validateUser(data);

    const token = await this.generateToken(user);

    return { user, token };
  }

  async registration(data: CreateUserDto) {
    const { email, password } = data;

    if (!email || !password) {
      throw new HttpException(
        "Некорректная почта или пароль",
        HttpStatus.BAD_REQUEST
      );
    }

    const candidate = await this.userService.getUserByEmail(email);

    if (candidate) {
      throw new HttpException(
        "Пользователь с такой почтой уже зарегистрирован",
        HttpStatus.BAD_REQUEST
      );
    }

    const hashPass = await bcrypt.hash(password, 5);

    const user = await this.userService.create({ ...data, password: hashPass });

    const token = await this.generateToken(user);

    return { user, token };
  }

  async check(data: User) {
    const token = await this.generateToken(data);

    return { token };
  }

  private async generateToken(user: User) {
    const { id, email, roles } = user;

    return this.jwtService.sign({ id, email, roles });
  }

  private async validateUser(data: CreateUserDto) {
    const { email, password } = data;

    const user = await this.userService.getUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException({ message: "Неверно указана почта" });
    }

    const passwordEqauls = await bcrypt.compare(password, user.password);

    if (!passwordEqauls) {
      throw new UnauthorizedException({ message: "Неверно указан пароль" });
    }

    return user;
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;
    const user = await this.userService.getUserByEmail(email);

    if (!user) {
      throw new BadRequestException("Пользователь с таким email не найден");
    }

    const token = await this.generateToken(user);

    const forgotLink = `${process.env.CLIENT_APP_URL}/auth/resetPass?token=${token}`;

    await this.mailerService
      .sendMail({
        to: user.email,
        from: process.env.MAILDEV_INCOMING_USER,
        subject: "Восстановление пароля",
        html: `
          <h3>Приветствуем!</h3>
          <p>Пожалуйста, используйте данную <a href="${forgotLink}">cсылку</a> для сброса пароля.</p>
        `,
      })
      .catch(() => {
        throw new InternalServerErrorException(
          "Возникла ошибка! Пожалуйста повторите попытку или попробуйте позже"
        );
      });
  }

  async changePassword(
    userFromReq: User,
    changePasswordDto: ChangePasswordDto
  ) {
    const { id } = userFromReq;
    const { password } = changePasswordDto;

    const user = await this.userService.findById(id);

    // неправильно отрабатывает
    // const passwordEqauls = await bcrypt.compare(user.password, password);

    // if (passwordEqauls) {
    //   throw new UnauthorizedException({
    //     message: "Пароль уже использовался! Введите другой пароль.",
    //   });
    // }

    const hashPass = await bcrypt.hash(password, 5);

    await this.connection.manager.save(User, { ...user, password: hashPass });

    return true;
  }
}
