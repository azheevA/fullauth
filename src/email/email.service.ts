import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { render } from '@react-email/components';
import { Resend } from 'resend';
import { ConfirmationTemplate } from './temlates/confirmation.template';
import { ResetPasswordTemplate } from './temlates/reset-password.template';
import { TwoFactoryTemplate } from './temlates/two-factory.template';
@Injectable()
export class EmailService {
  private resend: Resend;
  constructor(private readonly configService: ConfigService) {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  public async sendConfirmationEmail(email: string, token: string) {
    const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN');
    const html = await render(ConfirmationTemplate({ domain, token }));
    return this.sendEmail(email, 'Подтверждение почты', html);
  }

  public async sendResetPasswordEmail(email: string, token: string) {
    const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN');
    const html = await render(ResetPasswordTemplate({ domain, token }));
    return this.sendEmail(email, 'Сброс пароля', html);
  }
  public async sendTwoFactorTokenEmail(email: string, token: string) {
    const html = await render(TwoFactoryTemplate({ token }));
    return this.sendEmail(email, 'Подтверждение вашей личности', html);
  }

  private async sendEmail(to: string, subject: string, html: string) {
    return await this.resend.emails.send({
      from: 'onboarding@resend.dev',
      to,
      subject,
      html,
    });
  }
}
