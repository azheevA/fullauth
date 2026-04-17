import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProviderService } from '../provider/provider.service';
import { Request } from 'express';

@Injectable()
export class AuthProviderGuard implements CanActivate {
  public constructor(private readonly providerService: ProviderService) {}

  public canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const providerParam = request.params.provider;
    const provider = Array.isArray(providerParam)
      ? providerParam[0]
      : providerParam;

    const providerInstance = this.providerService.findByService(provider);
    if (!providerInstance) {
      throw new NotFoundException(
        `Провайдер "${provider}" не найден. Пожалуйста, проверьте правильность введенных данных`,
      );
    }
    return true;
  }
}
