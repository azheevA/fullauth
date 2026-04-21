import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';
import { TokenType } from '@prisma/generated';

@Injectable()
export class EmailConfimationService {
  public constructor(private readonly prismaService: PrismaService) {}

  private async generateVerificationToken(email: string) {
    const token = uuidv4();
    const expiresIn = new Date(new Date().getTime() + 3600 * 1000);
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
