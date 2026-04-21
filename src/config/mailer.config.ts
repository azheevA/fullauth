import { ConfigService } from '@nestjs/config';
import { MailerOptions } from '@nestjs-modules/mailer';
import { isDev } from '../libs/common/utils/is-de.util';

export const getMailerConfig = async (
  configService: ConfigService,
): Promise<MailerOptions> =>
  Promise.resolve({
    transport: {
      host: configService.getOrThrow<string>('MAIL_HOST'),
      port: configService.getOrThrow<number>('MAIL_PORT'),
      secure: !isDev(configService),
      auth: {
        user: configService.getOrThrow<string>('MAIL_LOGIN'),
        password: configService.getOrThrow<string>('MAIL_PASSWORD'),
      },
    },
    default: {
      from: `"Auth team ${configService.getOrThrow<string>('MAIL_LOGIN')}"`,
    },
  });
