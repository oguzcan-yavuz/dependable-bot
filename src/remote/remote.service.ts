import { Injectable, Scope, Inject } from '@nestjs/common';
import { RemoteAdapter, DependencyMap } from './remote.types';

@Injectable({
  scope: Scope.REQUEST,
})
export class RemoteService {
  constructor(
    @Inject('REMOTE_ADAPTER')
    private adapter: RemoteAdapter,
  ) {}

  getDependencies(repositoryUrl: string): Promise<DependencyMap> {
    return this.adapter.getDependencies(repositoryUrl);
  }
}
