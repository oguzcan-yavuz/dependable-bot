import { RemoteAdapter, Dependency } from '../remote.types';

export class GithubAdapter implements RemoteAdapter {
  async getDependencies(repositoryUrl: string): Promise<Dependency[]> {
    return [{ name: 'github', version: '1.2.3' }];
  }
}
