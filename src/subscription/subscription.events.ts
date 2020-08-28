import { EventEmitter } from 'events';
import { StrictEventEmitter } from 'nest-emitter';
import { Email } from '../email/email.types';

interface SubscriptionEvents {
  newSubscription: string;
  checkOutdatedDependencies: string;
  newEmail: Email;
}

export type SubscriptionEventEmitter = StrictEventEmitter<
  EventEmitter,
  SubscriptionEvents
>;
