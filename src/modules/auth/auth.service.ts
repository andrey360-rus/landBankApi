import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { User } from "../users/entities/users.entity";

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService
  ) {}

  async login(data: CreateUserDto) {
    const user = await this.validateUser(data);

    const token = await this.generateToken(user);

    return token;
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

    return token;
  }

  private async generateToken(user: User) {
    const { id, email, roles } = user;

    return {
      token: this.jwtService.sign({ id, email, roles }),
    };
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
}
