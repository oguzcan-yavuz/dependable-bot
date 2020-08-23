import { Injectable } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { Subscription } from './schema/subscription.schema';
import { SubscriptionRepository } from './subscription.repository';

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
  ) {}

  async createSubscription(
    createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<Subscription> {
    const subscription = await this.subscriptionRepository.create(
      createSubscriptionDto,
    );

    return subscription;
  }
}
