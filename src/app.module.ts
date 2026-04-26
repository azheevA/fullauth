import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ProviderModule } from './auth/provider/provider.module';
import { EmailConfimationModule } from './auth/email-confimation/email-confimation.module';
import { PasswordRecoveryModule } from './auth/password-recovery/password-recovery.module';
import { TwoFactorAuthModule } from './two-factor-auth/two-factor-auth.module';
import { EmailModule } from './email/email.module';
@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: false,
      envFilePath: '.env',
      expandVariables: true,
    }),
    AuthModule,
    UserModule,
    ProviderModule,
    EmailModule,
    EmailConfimationModule,
    PasswordRecoveryModule,
    TwoFactorAuthModule,
  ],
})
export class AppModule {}
