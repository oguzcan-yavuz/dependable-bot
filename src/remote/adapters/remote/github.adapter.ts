import {
  RemoteAdapter,
  DependenciesAndDependencyManager,
  DependencyManager,
} from '../../remote.types';

export class GithubAdapter implements RemoteAdapter {
  async getDependenciesAndDependencyManager(
    repositoryUrl: string,
  ): Promise<DependenciesAndDependencyManager> {
    return {
      dependencies: [{ name: 'github', version: '1.2.3' }],
      dependencyManager: DependencyManager.NpmOrYarn,
    };
  }
}
