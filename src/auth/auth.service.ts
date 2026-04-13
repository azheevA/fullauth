import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { RegisterDto } from './auth.dto';
import { UserService } from '../user/user.service';
import { AuthMethod, User } from '@prisma/generated';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  public async register(req: Request, dto: RegisterDto) {
    const isExists = await this.userService.findByEmail(dto.email);
    if (isExists) {
      throw new ConflictException(`
            Регистрация не удалось. Пользователь с таким email уже существует. Пожалуйста, используйте другой email иди войдите в другой аккаунт
        `);
    }
    const newUser = await this.userService.create(
      dto.email,
      dto.password,
      dto.name,
      '',
      AuthMethod.CREDINTIALS,
      false,
    );
    return this.saveSession(req, newUser);
  }

  public async login() {}

  public async logout() {}

  private saveSession(req: Request, user: User) {
    return new Promise((resolve, reject) => {
      req.session.userId = user.id;

      req.session.save((err) => {
        if (err) {
          return reject(
            new InternalServerErrorException(
              'Не удалось сохранить сессию. Проверьте правильно ли настроены параметры сессии',
            ),
          );
        }
        resolve({
          user,
        });
      });
    });
  }
}
