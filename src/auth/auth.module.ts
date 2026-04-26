import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getRecaptchaConfig } from '../config/recaptcha.config';
import { ProviderModule } from './provider/provider.module';
import { getProvidersConfig } from '../config/providers.config';
import { EmailConfimationModule } from './email-confimation/email-confimation.module';
import { UserService } from '../user/user.service';
import { EmailService } from '../email/email.service';
import { TwoFactorAuthService } from '../two-factor-auth/two-factor-auth.service';

@Module({
  imports: [
    UserModule,
    ProviderModule.registerAsync({
      imports: [ConfigModule],
      useFactory: getProvidersConfig,
      inject: [ConfigService],
    }),
    GoogleRecaptchaModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getRecaptchaConfig,
      inject: [ConfigService],
    }),
    forwardRef(() => EmailConfimationModule),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, EmailService, TwoFactorAuthService],
  exports: [AuthService],
})
export class AuthModule {}
