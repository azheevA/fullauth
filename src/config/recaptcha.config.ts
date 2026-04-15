import { ConfigService } from '@nestjs/config';
import { GoogleRecaptchaModuleOptions } from '@nestlab/google-recaptcha';
import { isDev } from '../libs/common/utils/is-de.util';

interface RecaptchaRequest extends Request {
  headers: Request['headers'] & {
    recaptcha?: string;
  };
}

export const getRecaptchaConfig = (
  configService: ConfigService,
): GoogleRecaptchaModuleOptions => ({
  secretKey: configService.getOrThrow<string>('GOOGLE_RECAPTCHA_SECRET_KEY'),
  response: (req: RecaptchaRequest) => {
    const token = req.headers.recaptcha;
    return typeof token === 'string' ? token : '';
  },
  skipIf: isDev(configService),
});
