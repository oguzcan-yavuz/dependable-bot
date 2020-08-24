import { Injectable, BadRequestException } from '@nestjs/common';
import { SubscriptionEntity } from '../subscription/subscription.types';
import {
  ValueOfRemoteRepositoryProvider,
  RemoteRepositoryProvider,
} from './remote.types';

@Injectable()
export class RemoteService {
  getRemoteRepositoryProvider(
    repositoryUrl: SubscriptionEntity['repositoryUrl'],
  ): ValueOfRemoteRepositoryProvider {
    const url = new URL(repositoryUrl);
    const { hostname } = url;

    const isValid = Object.values(RemoteRepositoryProvider).includes(hostname);

    if (!isValid) {
      throw new BadRequestException(
        'This remote repository provider is not supported.',
      );
    }

    return hostname;
  }
}
