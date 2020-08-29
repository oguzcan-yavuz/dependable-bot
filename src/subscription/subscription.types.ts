import { RemoteProvider } from '../remote/remote.types';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';

export type SubscriptionEntity = {
  _id: string;
  repositoryUrl: string;
  emails: string[];
  remoteProvider: RemoteProvider;
};

export type SubscriptionBody = CreateSubscriptionDto & {
  remoteProvider: RemoteProvider;
};

export const SubscriptionQueue = 'subscriptions';

export enum SubscriptionJobs {
  checkOutdatedDependencies = 'checkOutdatedDependencies',
}

export type SubscriptionId = {
  subscriptionId: SubscriptionEntity['_id'];
};
