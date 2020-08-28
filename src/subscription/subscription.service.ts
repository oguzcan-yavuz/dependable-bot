import { Injectable, OnModuleInit } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { SubscriptionRepository } from './subscription.repository';
import { SubscriptionEntity } from './subscription.types';
import { RemoteService } from '../remote/remote.service';
import { InjectEventEmitter } from 'nest-emitter';
import { SubscriptionEventEmitter } from './subscription.events';
import { OutdatedDependency, RemoteProvider } from '../remote/remote.types';
import InvalidRemoteProviderException from './exceptions/invalid-remote-provider.exception';
import * as ms from 'ms';

@Injectable()
export class SubscriptionService implements OnModuleInit {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly remoteService: RemoteService,
    @InjectEventEmitter() private readonly emitter: SubscriptionEventEmitter,
  ) {}
  onModuleInit() {
    this.emitter.on('checkOutdatedDependencies', msg =>
      this.checkOutdatedDependencies(msg),
    );
  }

  getRemoteProvider(repositoryUrl: string): RemoteProvider | undefined {
    const hostnameToRemoteProviderMap = {
      'github.com': RemoteProvider.Github,
      'gitlab.com': RemoteProvider.Gitlab,
    };
    const { hostname } = new URL(repositoryUrl);

    return hostnameToRemoteProviderMap[hostname];
  }

  async createSubscription(
    createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<SubscriptionEntity> {
    const remoteProvider = this.getRemoteProvider(
      createSubscriptionDto.repositoryUrl,
    );
    if (!remoteProvider) {
      throw new InvalidRemoteProviderException();
    }
    const subscription = await this.subscriptionRepository.create({
      ...createSubscriptionDto,
      remoteProvider,
    });
    this.checkOutdatedDependencies(subscription._id);

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
      subscription.remoteProvider,
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
