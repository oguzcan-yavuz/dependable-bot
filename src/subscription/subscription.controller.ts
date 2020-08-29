import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { OutdatedDependency } from '../remote/remote.types';
import { ParseObjectIdPipe } from './pipe/parse-object-id.pipe';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { Id } from './subscription.types';

@ApiTags('subscriptions')
@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Creates a subscription',
    type: Id,
  })
  async createSubscription(
    @Body() createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<Id> {
    const { _id: id } = await this.subscriptionService.createSubscription(
      createSubscriptionDto,
    );

    return { id };
  }

  @Get(':subscriptionId/outdated-dependencies')
  @ApiResponse({
    status: 200,
    description:
      'Lists the outdated dependencies of the given repository for the subscription',
    isArray: true,
    type: OutdatedDependency,
  })
  getOutdatedDependencies(
    @Param('subscriptionId', new ParseObjectIdPipe()) subscriptionId: string,
  ): Promise<OutdatedDependency[]> {
    return this.subscriptionService.getOutdatedDependencies(subscriptionId);
  }
}
