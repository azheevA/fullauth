/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthMethod, User } from '@prisma/generated';
import { hash } from 'argon2';
@Injectable()
export class UserService {
  public constructor(private readonly prismaService: PrismaService) {}

  public async findById(id: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
      include: {
        accounts: true,
      },
    });
    if (!user) {
      throw new NotFoundException(
        'Пользователь не найден. Пожалуйста, проверьте введенные данные',
      );
    }
    return user;
  }

  public async findByEmail(email: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
      include: {
        accounts: true,
      },
    });
    if (!user) {
      throw new NotFoundException(
        'Пользователь не найден. Пожалуйста, проверьте введенные данные',
      );
    }
    return user;
  }

  public async create(
    email: string,
    password: string,
    displayName: string,
    picture: string,
    method: AuthMethod,
    isVerified: boolean,
  ): Promise<User> {
    const user = await this.prismaService.user.create({
      data: {
        email,
        password: password ? await hash(password) : '',
        displayName,
        picture,
        method,
        isVerified,
      },
      include: {
        accounts: true,
      },
    });
    return user;
  }
}
