import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectEventEmitter } from 'nest-emitter';
import { SubscriptionEventEmitter } from '../subscription/subscription.events';
import { Email } from './email.types';

@Injectable()
export class EmailService implements OnModuleInit {
  constructor(
    @InjectEventEmitter() private readonly emitter: SubscriptionEventEmitter,
  ) {}
  onModuleInit() {
    this.emitter.on('newEmail', msg => this.sendEmail(msg));
  }
  sendEmail({ to, title, message }: Email): void {
    console.log(
      `sending an email to: ${to} with title "${title}" and message: "${message}"`,
    );
  }
}
