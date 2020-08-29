import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { OutdatedDependency } from '../remote/remote.types';
import { ParseObjectIdPipe } from './pipe/parse-object-id.pipe';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  async createSubscription(
    @Body() createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<{ id: string }> {
    const { _id: id } = await this.subscriptionService.createSubscription(
      createSubscriptionDto,
    );

    return { id };
  }

  @Get(':subscriptionId/outdated-dependencies')
  getOutdatedDependencies(
    @Param('subscriptionId', new ParseObjectIdPipe()) subscriptionId: string,
  ): Promise<OutdatedDependency[]> {
    return this.subscriptionService.getOutdatedDependencies(subscriptionId);
  }
}
