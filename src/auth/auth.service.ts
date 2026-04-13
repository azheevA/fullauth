import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto, RegisterDto } from './auth.dto';
import { UserService } from '../user/user.service';
import { AuthMethod, User } from '@prisma/generated';
import { Request, Response } from 'express';
import { verify } from 'argon2';

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

  public async login(req: Request, dto: LoginDto) {
    const user = await this.userService.findByEmail(dto.email);
    if (!user || !user.password) {
      throw new NotFoundException(
        'Пользователь не найден. Пожалуйста, проверьте введеные данные',
      );
    }
    const isValidPassword = await verify(user.password, dto.password);
    if (!isValidPassword) {
      throw new UnauthorizedException(
        'Неверный пароль. Пожалуйста, попробуйте ещё раз или восстановите пароль, если забыли его.',
      );
    }
    return this.saveSession(req, user);
  }

  public async logout(req: Request) {
    return new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          return reject(
            new InternalServerErrorException(
              'Не удалось завершить сессию.Возможно возникла проблема с сервером или сессия уже была завершена',
            ),
          );
        }

        resolve({ message: 'Вы успешно вышли из системы' });
      });
    });
  }

  private saveSession(req: Request, user: User) {
    return new Promise((resolve, reject) => {
      req.session.userId = user.id;

      req.session.save((err) => {
        if (err) {
          console.error('ОШИБКА ПРИ СОХРАНЕНИИ СЕССИИ:', err);
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
