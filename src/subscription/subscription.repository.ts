import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Subscription } from './schema/subscription.schema';
import { Model } from 'mongoose';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';

@Injectable()
export class SubscriptionRepository {
  constructor(
    @InjectModel(Subscription.name)
    private readonly subscriptionModel: Model<Subscription>,
  ) {}

  async create(
    createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<Subscription> {
    const subscription = await this.subscriptionModel.create(
      createSubscriptionDto,
    );

    return subscription;
  }
}
