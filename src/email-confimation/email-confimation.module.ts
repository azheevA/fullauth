import { forwardRef, Module } from '@nestjs/common';
import { EmailConfimationService } from './email-confimation.service';
import { EmailConfimationController } from './email-confimation.controller';
import { EmailModule } from '../email/email.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [EmailModule, forwardRef(() => AuthModule)],
  controllers: [EmailConfimationController],
  providers: [EmailConfimationService],
  exports: [EmailConfimationService],
})
export class EmailConfimationModule {}
