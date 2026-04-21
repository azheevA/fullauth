import { Controller } from '@nestjs/common';
import { EmailConfimationService } from './email-confimation.service';

@Controller('email-confimation')
export class EmailConfimationController {
  constructor(private readonly emailConfimationService: EmailConfimationService) {}
}
