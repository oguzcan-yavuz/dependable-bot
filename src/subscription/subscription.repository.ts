import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Subscription } from './schema/subscription.schema';
import { Model } from 'mongoose';
import { SubscriptionEntity, SubscriptionBody } from './subscription.types';

@Injectable()
export class SubscriptionRepository {
  constructor(
    @InjectModel(Subscription.name)
    private readonly subscriptionModel: Model<Subscription>,
  ) {}

  async create(
    subscriptionBody: SubscriptionBody,
  ): Promise<SubscriptionEntity> {
    const subscription = await this.subscriptionModel.create(subscriptionBody);

    return subscription as SubscriptionEntity;
  }

  async getById(
    subscriptionId: SubscriptionEntity['_id'],
  ): Promise<SubscriptionEntity | undefined> {
    const subscription = await this.subscriptionModel
      .findById(subscriptionId)
      .lean<SubscriptionEntity>();

    return subscription;
  }
}
