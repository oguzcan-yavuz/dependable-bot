import { RemoteAdapter, DependencyMap } from '../remote.types';

export class GitlabAdapter implements RemoteAdapter {
  async getDependencies(repositoryUrl: string): Promise<DependencyMap> {
    return new Map([['gitlab', '1.2.3']]);
  }
}
