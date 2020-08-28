import { RemoteProvider } from '../remote/remote.types';

export type SubscriptionEntity = {
  _id: string;
  repositoryUrl: string;
  emails: string[];
  remoteProvider: RemoteProvider;
};
