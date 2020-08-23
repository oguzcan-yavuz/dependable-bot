import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Subscription, SubscriptionSchema } from './schema/subscription.schema';
import { SubscriptionRepository } from './subscription.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Subscription.name, schema: SubscriptionSchema },
    ]),
  ],
  controllers: [SubscriptionController],
  providers: [SubscriptionService, SubscriptionRepository],
})
export class SubscriptionModule {}
