import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserService } from '../../user/user.service';
import { EmailService } from '../../email/email.service';
import { randomUUID } from 'crypto';
import { TokenType } from '@prisma/generated';
import { NewPasswordDto, ResetPasswordDto } from './password-recovery.dto';
import { hash } from 'argon2';

@Injectable()
export class PasswordRecoveryService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
    private readonly emailService: EmailService,
  ) {}

  public async resetPassword(dto: ResetPasswordDto) {
    const existingUser = await this.userService.findByEmail(dto.email);
    if (!existingUser) {
      throw new NotFoundException(
        `Пользователь не найден. Пожалуйста, проверьте введенный адрес электронной почты и попробуйте снова`,
      );
    }
    const passwordResetToken = await this.generateResetPasswordToken(
      existingUser.email,
    );

    await this.emailService.sendResetPasswordEmail(
      passwordResetToken.email,
      passwordResetToken.token,
    );
    return true;
  }
  public async newPassword(dto: NewPasswordDto, token: string) {
    const existingToken = await this.prismaService.token.findFirst({
      where: {
        token,
        type: TokenType.PASSWORD_RESET,
      },
    });
    if (!existingToken) {
      throw new NotFoundException(
        'Токен не найден.Пожалуйста, проверьте правильность токена или запросите новый.',
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
        password: await hash(dto.password),
      },
    });
    await this.prismaService.token.delete({
      where: {
        id: existingToken.id,
        type: TokenType.PASSWORD_RESET,
      },
    });
    return true;
  }

  private async generateResetPasswordToken(email: string) {
    const token = randomUUID();
    const expiresAt = new Date(new Date().getTime() + 3600 * 1000);
    const existingToken = await this.prismaService.token.findFirst({
      where: {
        email,
        type: TokenType.PASSWORD_RESET,
      },
    });
    if (existingToken) {
      await this.prismaService.token.delete({
        where: {
          id: existingToken.id,
          type: TokenType.PASSWORD_RESET,
        },
      });
    }
    const resetPasswordToken = await this.prismaService.token.create({
      data: {
        email,
        token,
        expiresAt,
        type: TokenType.PASSWORD_RESET,
      },
    });
    return resetPasswordToken;
  }
}
