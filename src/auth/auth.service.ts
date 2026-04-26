import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto, RegisterDto } from './auth.dto';
import { UserService } from '../user/user.service';
import { AuthMethod, User } from '@prisma/generated';
import { Request } from 'express';
import { verify } from 'argon2';
import { ProviderService } from './provider/provider.service';
import { PrismaService } from '../prisma/prisma.service';
import { EmailConfimationService } from './email-confimation/email-confimation.service';
import { TwoFactorAuthService } from '../two-factor-auth/two-factor-auth.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
    private readonly providerService: ProviderService,
    private readonly emailConfirmationService: EmailConfimationService,
    private twoFactorAuthService: TwoFactorAuthService,
  ) {}

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
    await this.emailConfirmationService.sendVerificationToken(newUser.email);
    return {
      message:
        'Вы успешно зарегистрировались. Пожалуйста, подтвердите свой email. Сообщение было отправлено на ваш почтовый адрес.',
    };
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
    if (!user.isVerified) {
      await this.emailConfirmationService.sendVerificationToken(user.email);
      throw new UnauthorizedException(
        `Ваш email не подтвержден. Пожалуйста, проверьте вашу почту и подтвердите адрес`,
      );
    }

    if (user.isTwoFactorEnabled) {
      if (!dto.code) {
        await this.twoFactorAuthService.sendTwoFactorToken(user.email);
        return {
          message:
            'Проверьте вашу почту. Требуется код двухфакторной аутентификации',
        };
      }
      await this.twoFactorAuthService.validateTwoFactorToken(
        user.email,
        dto.code,
      );
    }

    return this.saveSession(req, user);
  }

  public async extractProfileFromCode(
    req: Request,
    provider: string,
    code: string,
  ) {
    const providerInstance = this.providerService.findByService(provider);
    const profile = await providerInstance?.findUserByCode(code);
    const account = await this.prismaService.account.findFirst({
      where: {
        id: profile?.id,
        provider: profile?.provider,
      },
    });
    let user = account?.userId
      ? await this.userService.findById(account.userId)
      : null;

    if (user) {
      return this.saveSession(req, user);
    }
    if (!profile || !profile.email || !profile.provider) {
      throw new BadRequestException('Invalid OAuth profile');
    }
    user = await this.userService.create(
      profile?.email,
      '',
      profile?.name,
      profile?.picture,
      AuthMethod[profile?.provider.toUpperCase() as keyof typeof AuthMethod],
      true,
    );
    if (!account) {
      await this.prismaService.account.create({
        data: {
          userId: user.id,
          type: 'oauth',
          provider: profile?.provider,
          accessToken: profile?.access_token,
          refreshToken: profile?.refresh_token,
          expiresAt: profile?.expires_at ?? 0,
        },
      });
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

  public saveSession(req: Request, user: User) {
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
