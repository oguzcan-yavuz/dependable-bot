import { Injectable } from '@nestjs/common';
import { EmailEntity, EmailQueue, EmailJobs } from './email.types';
import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
@Processor(EmailQueue)
export class EmailService {
  constructor(
    @InjectPinoLogger(EmailService.name)
    private readonly logger: PinoLogger,
  ) {}
  @Process(EmailJobs.sendEmail)
  sendEmail({ data: { to, title, message } }: Job<EmailEntity>): void {
    this.logger.info(
      `sending an email to: ${to} with title "${title}" and message: "${message}"`,
    );
  }
}
