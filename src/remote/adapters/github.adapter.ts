import { RemoteAdapter, DependencyMap } from '../remote.types';

export class GithubAdapter implements RemoteAdapter {
  async getDependencies(repositoryUrl: string): Promise<DependencyMap> {
    return new Map([['github', '1.2.3']]);
  }
}
