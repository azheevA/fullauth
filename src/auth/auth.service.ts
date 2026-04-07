import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './auth.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
  ) {}

  public async register(dto: RegisterDto) {
    const isExists = await this.userService.findByEmail(dto.email);
    if (isExists) {
      throw new ConflictException(`
            Регистрация не удалось. Пользователь с таким email уже существует. Пожалуйста, используйте другой email иди войдите в другой аккаунт
        `);
    }
    const newUser = await this.userService.create({
        dto.email, 
        dto.password,
        dto.name,
        '',
        AuthMethod.CREDENTIALS,
        false
    })
    return newUser;
  }

  public async login() {}

  public async logout() {}

  private async saveSession() {}
}
