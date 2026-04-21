import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ProviderModule } from './auth/provider/provider.module';
import { EmailModule } from './email/email.module';
import { EmailConfimationModule } from './email-confimation/email-confimation.module';
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
  ],
})
export class AppModule {}
