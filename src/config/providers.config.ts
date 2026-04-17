import { ConfigService } from '@nestjs/config';
import { TypeOptions } from '../auth/provider/provider.constants';
import { GoogleProvider } from '../auth/provider/services/google.provider';
import { YandexProvider } from '../auth/provider/services/yandex.provider';

export const getProvidersConfig = (
  ConfigService: ConfigService,
): TypeOptions => ({
  baseUrl: ConfigService.getOrThrow<string>('DATABASE_URL'),
  services: [
    new GoogleProvider({
      client_id: ConfigService.getOrThrow<string>('GOOGLE_CLIENT_ID'),
      client_secret: ConfigService.getOrThrow<string>('GOOGLE_CLIENT_SECRET'),
      scopes: ['email', 'profile'],
    }),
    new YandexProvider({
      client_id: ConfigService.getOrThrow<string>('YANDEX_CLIENT_ID'),
      client_secret: ConfigService.getOrThrow<string>('YANDEX_CLIENT_SECRET'),
      scopes: ['login:email', 'login:avatar', 'login:info'],
    }),
  ],
});
