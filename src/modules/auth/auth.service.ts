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
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
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

    const token = await this.generateToken(user as User);

    const verifyEmailLink = `${process.env.CLIENT_APP_URL}/auth/verify_email?token=${token}`;

    await this.mailerService
      .sendMail({
        to: user.email,
        from: process.env.MAILDEV_INCOMING_USER,
        subject: "Потдверждение регистрации",
        html: `
          <h3>Приветствуем!</h3>
          <p>Пожалуйста, используйте данную <a href="${verifyEmailLink}" target='_blank'>cсылку</a> для потдверждения регистрации!</p>
          <p>Если вы не регистрировались на нашем сайте <a href="${process.env.CLIENT_APP_URL}" target='_blank'>Bank-Zemel</a>, то проигнорируйте это письмо!</p>
        `,
      })
      .catch(() => {
        throw new InternalServerErrorException(
          "Возникла ошибка! Пожалуйста повторите попытку или попробуйте позже"
        );
      });
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

    if (!user.isActive) {
      throw new UnauthorizedException({
        message:
          "Необходимо завершить регистрацию! Перейдите по ссылке из письма, отправленного на E-mail, указанный при регистрации!",
      });
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
          <p>Пожалуйста, используйте данную <a href="${forgotLink}" target='_blank'>cсылку</a> для сброса пароля.</p>
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

    const hashPass = await bcrypt.hash(password, 5);

    await this.usersRepository.save({ ...user, password: hashPass });

    return true;
  }

  async verifyEmail(userFromReq: User) {
    const { id } = userFromReq;

    await this.userService.setStatusUser({ id, isActive: true });

    return true;
  }
}
