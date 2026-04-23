import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';
import { TokenType, User } from '@prisma/generated';
import { ConfirmationDto } from './email.dto';
import { Request } from 'express';
import { EmailService } from '../email/email.service';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class EmailConfimationService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly emailService: EmailService,
    private readonly userService: UserService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  public async newVerification(req: Request, dto: ConfirmationDto) {
    const existingToken = await this.prismaService.token.findUnique({
      where: {
        token: dto.token,
        type: TokenType.VERIFICATION,
      },
    });
    if (!existingToken) {
      throw new NotFoundException(
        `Токен подтверждения не найден. Пожалуйста, убедитесь, что у вас правильный токен`,
      );
    }
    const hasExiped = new Date(existingToken.expiresAt) < new Date();
    if (hasExiped) {
      throw new BadRequestException(
        `Токен подтверждения истек. Пожалуйста, запросите новый токен для подтверждения`,
      );
    }
    const existingUser = await this.userService.findByEmail(
      existingToken.email,
    );
    if (!existingUser) {
      throw new NotFoundException(
        `Пользователь с указанным адресом электронной почты не найден`,
      );
    }
    await this.prismaService.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        isVerified: true,
      },
    });
    await this.prismaService.user.delete({
      where: {
        id: existingToken.id,
        type: TokenType.VERIFICATION,
      },
    });
    return this.authService.saveSession(req, existingUser);
  }

  public async sendVerificationToken(user: User) {}

  private async generateVerificationToken(email: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const token = uuidv4() as string;
    const expiresAt = new Date(new Date().getTime() + 3600 * 1000);
    const existingToken = await this.prismaService.token.findFirst({
      where: {
        email,
        type: TokenType.VERIFICATION,
      },
    });
    if (existingToken) {
      await this.prismaService.token.delete({
        where: {
          id: existingToken.id,
          type: TokenType.VERIFICATION,
        },
      });
    }
    const verificationToken = await this.prismaService.token.create({
      data: {
        email,
        token,
        expiresAt,
        type: TokenType.VERIFICATION,
      },
    });
    return verificationToken;
  }
}
