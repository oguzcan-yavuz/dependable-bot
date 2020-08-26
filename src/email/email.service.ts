import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectEventEmitter } from 'nest-emitter';
import {
  SubscriptionEventEmitter,
  OutdatedDependenciesOfSubscription,
} from '../subscription/subscription.events';
import { SubscriptionService } from '../subscription/subscription.service';

@Injectable()
export class EmailService implements OnModuleInit {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    @InjectEventEmitter() private readonly emitter: SubscriptionEventEmitter,
  ) {}
  onModuleInit() {
    this.emitter.on('newOutdatedDependencies', msg =>
      this.reportOutdatedDependencies(msg),
    );
  }
  sendEmail(to: string, title: string, message: string): void {
    console.log(
      `sending an email to: ${to} with title "${title}" and message: "${message}"`,
    );
  }
  async reportOutdatedDependencies(
    outdatedDependenciesOfSubscription: OutdatedDependenciesOfSubscription,
  ): Promise<void> {
    const subscription = await this.subscriptionService.getSubscription(
      outdatedDependenciesOfSubscription.subscriptionId,
    );

    outdatedDependenciesOfSubscription.outdatedDependencies.forEach(
      dependency => {
        subscription.emails.forEach(email => {
          const to = email;
          const title = 'New outdated dependency!';
          const message = `You can update ${dependency.name} from ${dependency.version} to ${dependency.latestVersion}`;

          this.sendEmail(to, title, message);
        });
      },
    );
  }
}
