import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { TokenType } from '@prisma/generated';

@Injectable()
export class TwoFactorAuthService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  public async validateTwoFactorToken(email: string, code: string) {
    const existingToken = await this.prismaService.token.findFirst({
      where: {
        email,
        type: TokenType.TWO_FACTOR,
      },
    });
    if (!existingToken) {
      throw new NotFoundException(
        `Токен двухфакторной аутентификации не найден. Убедитесь, что вы запрашивали токен для данного адреса`,
      );
    }
    if (existingToken.token !== code) {
      throw new BadRequestException(
        'Не верный код двухфакторной аутентификации. Пожалуйста, проверьте введеный код и попробуйте снова',
      );
    }
    const hasExiped = new Date(existingToken.expiresAt) < new Date();
    if (hasExiped) {
      throw new BadRequestException(
        `Срок действия токена двухфакторной аутентификации истек. Пожалуйста, запросите новый токен`,
      );
    }
    await this.prismaService.token.delete({
      where: {
        id: existingToken.id,
        type: TokenType.TWO_FACTOR,
      },
    });
    return true;
  }
  public async sendTwoFactorToken(email: string) {
    const twoFactorToken = await this.generateTwoFactorToken(email);
    await this.emailService.sendTwoFactorTokenEmail(
      twoFactorToken.email,
      twoFactorToken.token,
    );
    return true;
  }
  private async generateTwoFactorToken(email: string) {
    const token = Math.floor(
      Math.random() * (1000000 - 100000) + 100000,
    ).toString();
    const expiresAt = new Date(new Date().getTime() + 60 * 15 * 1000);
    const existingToken = await this.prismaService.token.findFirst({
      where: {
        email,
        type: TokenType.TWO_FACTOR,
      },
    });
    if (existingToken) {
      await this.prismaService.token.delete({
        where: {
          id: existingToken.id,
          type: TokenType.TWO_FACTOR,
        },
      });
    }
    const verificationToken = await this.prismaService.token.create({
      data: {
        email,
        token,
        expiresAt,
        type: TokenType.TWO_FACTOR,
      },
    });
    return verificationToken;
  }
}
