import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Subscription, SubscriptionSchema } from './schema/subscription.schema';
import { SubscriptionRepository } from './subscription.repository';
import { RemoteModule } from '../remote/remote.module';
import { BullModule } from '@nestjs/bull';
import { SubscriptionQueue } from './subscription.types';
import { EmailQueue } from '../email/email.types';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Subscription.name, schema: SubscriptionSchema },
    ]),
    BullModule.registerQueue({
      name: SubscriptionQueue,
      redis: { host: 'localhost', port: 6379 },
    }),
    BullModule.registerQueue({
      name: EmailQueue,
      redis: { host: 'localhost', port: 6379 },
    }),
    RemoteModule,
  ],
  controllers: [SubscriptionController],
  providers: [SubscriptionService, SubscriptionRepository],
})
export class SubscriptionModule {}
