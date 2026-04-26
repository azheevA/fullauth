import { Module } from '@nestjs/common';
import { TwoFactorAuthService } from './two-factor-auth.service';
import { EmailService } from '../email/email.service';

@Module({
  providers: [TwoFactorAuthService, EmailService],
})
export class TwoFactorAuthModule {}
