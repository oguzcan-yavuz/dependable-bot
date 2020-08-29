import { Injectable } from '@nestjs/common';
import { EmailEntity, EmailQueue, EmailJobs } from './email.types';
import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';

@Injectable()
@Processor(EmailQueue)
export class EmailService {
  @Process(EmailJobs.sendEmail)
  sendEmail({ data: { to, title, message } }: Job<EmailEntity>): void {
    console.log(
      `sending an email to: ${to} with title "${title}" and message: "${message}"`,
    );
  }
}
