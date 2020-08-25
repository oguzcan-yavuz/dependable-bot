import { RemoteAdapter, Dependency } from '../remote.types';

export class GitlabAdapter implements RemoteAdapter {
  async getDependencies(repositoryUrl: string): Promise<Dependency[]> {
    return [{ name: 'gitlab', version: '9.8.7' }];
  }
}
