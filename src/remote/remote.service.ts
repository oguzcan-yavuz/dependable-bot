import { Injectable, Scope, Inject } from '@nestjs/common';
import { Dependency, RemoteAdapter } from './remote.types';

@Injectable({
  scope: Scope.REQUEST,
})
export class RemoteService {
  constructor(
    @Inject('REMOTE_ADAPTER')
    private adapter: RemoteAdapter,
  ) {}

  getDependencies(repositoryUrl: string): Promise<Dependency[]> {
    return this.adapter.getDependencies(repositoryUrl);
  }
}
