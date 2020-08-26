import { EventEmitter } from 'events';
import { StrictEventEmitter } from 'nest-emitter';
import { OutdatedDependency } from '../remote/remote.types';

export type OutdatedDependenciesOfSubscription = {
  subscriptionId: string;
  outdatedDependencies: OutdatedDependency[];
};

interface SubscriptionEvents {
  newSubscription: string;
  checkOutdatedDependencies: string;
  newOutdatedDependencies: OutdatedDependenciesOfSubscription;
}

export type SubscriptionEventEmitter = StrictEventEmitter<
  EventEmitter,
  SubscriptionEvents
>;
