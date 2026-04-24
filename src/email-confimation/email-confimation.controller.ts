import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { EmailConfimationService } from './email-confimation.service';
import { type Request } from 'express';
import { ConfirmationDto } from './email.dto';

@Controller('email-confimation')
export class EmailConfimationController {
  constructor(
    private readonly emailConfimationService: EmailConfimationService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  public async newVerification(
    @Req() req: Request,
    @Body() dto: ConfirmationDto,
  ) {
    return this.emailConfimationService.newVerification(req, dto);
  }
}
