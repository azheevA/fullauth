import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRole } from '@prisma/generated';
import { Request } from 'express';
type RequestUser = {
  id: string;
  role: UserRole | null;
};

export const Authorized = createParamDecorator(
  (data: keyof RequestUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request.user as RequestUser | null;
    if (!user) {
      throw new UnauthorizedException('Пользователь не авторизован');
    }
    return data ? user[data] : user;
  },
);
