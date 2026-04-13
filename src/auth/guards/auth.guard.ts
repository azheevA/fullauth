import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { UserService } from '../../user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const userId = request.session.userId;

    if (!userId) {
      throw new UnauthorizedException('Вы не авторизованы');
    }

    const user = await this.userService.findById(userId);

    if (!user) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    request.user = user;

    return true;
  }
}
