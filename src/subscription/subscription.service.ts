import { Injectable } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { SubscriptionRepository } from './subscription.repository';
import { SubscriptionEntity } from './subscription.types';
import { RemoteService } from '../remote/remote.service';
import { Dependency } from '../remote/remote.types';

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly remoteService: RemoteService,
  ) {}

  async createSubscription(
    createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<SubscriptionEntity> {
    const subscription = await this.subscriptionRepository.create(
      createSubscriptionDto,
    );

    return subscription;
  }

  async getOutdatedDependencies(
    subscriptionId: SubscriptionEntity['_id'],
  ): Promise<Dependency[]> {
    const subscription = await this.subscriptionRepository.getById(
      subscriptionId,
    );

    const dependencies = await this.remoteService.getDependencies(
      subscription.repositoryUrl,
    );

    return [];
  }
}
