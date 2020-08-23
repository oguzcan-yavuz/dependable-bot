import { Controller, Post, Body } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  async createSubscription(
    @Body() createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<void> {
    await this.subscriptionService.createSubscription(createSubscriptionDto);
  }
}
