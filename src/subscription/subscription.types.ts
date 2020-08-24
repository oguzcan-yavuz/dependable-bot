import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { ValueOfRemoteRepositoryProvider } from '../remote/remote.types';

export type SubscriptionEntity = {
  _id: string;
  repositoryUrl: string;
  emails: string[];
  remoteRepositoryProvider: ValueOfRemoteRepositoryProvider;
};

export type SubscriptionBody = CreateSubscriptionDto & {
  remoteRepositoryProvider: ValueOfRemoteRepositoryProvider;
};

export type OutdatedDependency = {
  name: string;
  currentVersion: string;
  latestVersion: string;
};
