import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { render } from '@react-email/components';
import { Resend } from 'resend';
import { ConfirmationTemplate } from './temlates/confirmation.template';
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

  async sendEmail(to: string, subject: string, html: string) {
    return await this.resend.emails.send({
      from: 'onboarding@resend.dev',
      to,
      subject,
      html,
    });
  }
}
