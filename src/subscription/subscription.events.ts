import { EventEmitter } from 'events';
import { StrictEventEmitter } from 'nest-emitter';
import { OutdatedDependency } from '../remote/remote.types';

interface SubscriptionEvents {
  newSubscription: string;
  checkOutdatedDependencies: void;
  newOutdatedDependencies: OutdatedDependency[];
}

export type SubscriptionEventEmitter = StrictEventEmitter<
  EventEmitter,
  SubscriptionEvents
>;
