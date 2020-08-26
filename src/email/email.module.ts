import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { SubscriptionModule } from '../subscription/subscription.module';

@Module({
  imports: [SubscriptionModule],
  providers: [EmailService],
})
export class EmailModule {}
