import { Injectable } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { SubscriptionRepository } from './subscription.repository';
import { OutdatedDependency, SubscriptionEntity } from './subscription.types';
import { RemoteService } from '../remote/remote.service';

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly remoteService: RemoteService,
  ) {}

  async createSubscription(
    createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<SubscriptionEntity> {
    const remoteRepositoryProvider = this.remoteService.getRemoteRepositoryProvider(
      createSubscriptionDto.repositoryUrl,
    );
    const subscriptionBody = {
      ...createSubscriptionDto,
      remoteRepositoryProvider,
    };
    const subscription = await this.subscriptionRepository.create(
      subscriptionBody,
    );

    return subscription;
  }

  async getOutdatedDependencies(
    subscriptionId: SubscriptionEntity['_id'],
  ): Promise<OutdatedDependency[]> {
    const subscription = await this.subscriptionRepository.getById(
      subscriptionId,
    );

    return [];
  }
}
