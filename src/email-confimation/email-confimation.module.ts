import { Module } from '@nestjs/common';
import { EmailConfimationService } from './email-confimation.service';
import { EmailConfimationController } from './email-confimation.controller';

@Module({
  controllers: [EmailConfimationController],
  providers: [EmailConfimationService],
})
export class EmailConfimationModule {}
