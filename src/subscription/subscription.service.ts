import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { SubscriptionRepository } from './subscription.repository';
import {
  SubscriptionEntity,
  SubscriptionQueue,
  SubscriptionJobs,
  SubscriptionId,
} from './subscription.types';
import { RemoteService } from '../remote/remote.service';
import { OutdatedDependency, RemoteProvider } from '../remote/remote.types';
import InvalidRemoteProviderException from './exceptions/invalid-remote-provider.exception';
import * as ms from 'ms';
import { InjectQueue, Processor, Process } from '@nestjs/bull';
import { Queue, Job } from 'bull';
import { EmailJobs, EmailQueue, EmailEntity } from '../email/email.types';

@Injectable()
@Processor(SubscriptionQueue)
export class SubscriptionService {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly remoteService: RemoteService,
    @InjectQueue(SubscriptionQueue)
    private readonly subscriptionQueue: Queue,
    @InjectQueue(EmailQueue)
    private readonly emailQueue: Queue,
  ) {}

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
    await this.subscriptionQueue.add(
      SubscriptionJobs.checkOutdatedDependencies,
      {
        subscriptionId: subscription._id,
      } as SubscriptionId,
    );

    return subscription;
  }

  async getSubscription(
    subscriptionId: SubscriptionEntity['_id'],
  ): Promise<SubscriptionEntity> {
    const subscription = await this.subscriptionRepository.getById(
      subscriptionId,
    );
    if (!subscription) {
      throw new NotFoundException();
    }

    return subscription;
  }

  async getOutdatedDependencies(
    subscriptionId: string,
  ): Promise<OutdatedDependency[]> {
    const subscription = await this.getSubscription(subscriptionId);

    const outdatedDependencies = await this.remoteService.getOutdatedDependencies(
      subscription.repositoryUrl,
      subscription.remoteProvider,
    );

    return outdatedDependencies;
  }

  @Process(SubscriptionJobs.checkOutdatedDependencies)
  async checkOutdatedDependencies({
    data: { subscriptionId },
  }: Job<SubscriptionId>): Promise<void> {
    const outdatedDependencies = await this.getOutdatedDependencies(
      subscriptionId,
    );
    if (outdatedDependencies.length > 0) {
      this.reportOutdatedDependencies(subscriptionId, outdatedDependencies);
    }

    await this.subscriptionQueue.add(
      SubscriptionJobs.checkOutdatedDependencies,
      {
        subscriptionId,
      } as SubscriptionId,
      { delay: ms('1 day') },
    );
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

        this.emailQueue.add(EmailJobs.sendEmail, {
          to,
          title,
          message,
        } as EmailEntity);
      });
    });
  }
}
