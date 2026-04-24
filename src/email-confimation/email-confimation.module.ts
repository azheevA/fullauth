import { forwardRef, Module } from '@nestjs/common';
import { EmailConfimationService } from './email-confimation.service';
import { EmailConfimationController } from './email-confimation.controller';
import { EmailModule } from '../email/email.module';
import { AuthModule } from '../auth/auth.module';
import { UserService } from '../user/user.service';
import { EmailService } from '../email/email.service';

@Module({
  imports: [EmailModule, forwardRef(() => AuthModule)],
  controllers: [EmailConfimationController],
  providers: [EmailConfimationService, UserService, EmailService],
  exports: [EmailConfimationService],
})
export class EmailConfimationModule {}
