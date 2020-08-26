import { Injectable, OnModuleInit } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { SubscriptionRepository } from './subscription.repository';
import { SubscriptionEntity } from './subscription.types';
import { RemoteService } from '../remote/remote.service';
import { InjectEventEmitter } from 'nest-emitter';
import { SubscriptionEventEmitter } from './subscription.events';
import * as ms from 'ms';
import { OutdatedDependency } from '../remote/remote.types';

@Injectable()
export class SubscriptionService implements OnModuleInit {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly remoteService: RemoteService,
    @InjectEventEmitter() private readonly emitter: SubscriptionEventEmitter,
  ) {}
  onModuleInit() {
    this.emitter.on('newSubscription', msg =>
      this.checkOutdatedDependencies(msg),
    );
  }
  async createSubscription(
    createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<SubscriptionEntity> {
    const subscription = await this.subscriptionRepository.create(
      createSubscriptionDto,
    );
    this.emitter.emit('newSubscription', subscription._id);

    return subscription;
  }

  async checkOutdatedDependencies(
    subscriptionId: SubscriptionEntity['_id'],
  ): Promise<OutdatedDependency[]> {
    const subscription = await this.subscriptionRepository.getById(
      subscriptionId,
    );

    const outdatedDependencies = await this.remoteService.getOutdatedDependencies(
      subscription.repositoryUrl,
    );

    if (outdatedDependencies.length > 0) {
      this.emitter.emit('newOutdatedDependencies', outdatedDependencies);
    }

    setTimeout(() => {
      this.emitter.emit('checkOutdatedDependencies');
    }, ms('1 day'));

    return outdatedDependencies;
  }
}
