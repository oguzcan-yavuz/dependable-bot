import { Injectable, OnModuleInit } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { SubscriptionRepository } from './subscription.repository';
import { SubscriptionEntity } from './subscription.types';
import { RemoteService } from '../remote/remote.service';
import { InjectEventEmitter } from 'nest-emitter';
import { SubscriptionEventEmitter } from './subscription.events';
import * as ms from 'ms';
import { OutdatedDependency, Dependency } from '../remote/remote.types';

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
    this.emitter.on('checkOutdatedDependencies', msg =>
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

  getSubscription(
    subscriptionId: SubscriptionEntity['_id'],
  ): Promise<SubscriptionEntity> {
    return this.subscriptionRepository.getById(subscriptionId);
  }

  async getOutdatedDependencies(
    subscriptionId: string,
  ): Promise<OutdatedDependency[]> {
    const subscription = await this.subscriptionRepository.getById(
      subscriptionId,
    );

    const outdatedDependencies = await this.remoteService.getOutdatedDependencies(
      subscription.repositoryUrl,
    );

    return outdatedDependencies;
  }

  async checkOutdatedDependencies(
    subscriptionId: SubscriptionEntity['_id'],
  ): Promise<void> {
    const outdatedDependencies = await this.getOutdatedDependencies(
      subscriptionId,
    );
    if (outdatedDependencies.length > 0) {
      this.reportOutdatedDependencies(subscriptionId, outdatedDependencies);
    }

    setTimeout(() => {
      this.emitter.emit('checkOutdatedDependencies', subscriptionId);
    }, ms('1 day'));
  }

  async reportOutdatedDependencies(
    subscriptionId: SubscriptionEntity['_id'],
    outdatedDependencies: OutdatedDependency[],
  ): Promise<void> {
    const subscription = await this.getSubscription(subscriptionId);

    outdatedDependencies.forEach(dependency => {
      subscription.emails.forEach(email => {
        const to = email;
        const title = 'New outdated dependency!';
        const message = `You can update ${dependency.name} from ${dependency.version} to ${dependency.latestVersion}`;

        this.emitter.emit('newEmail', { to, title, message });
      });
    });
  }
}
