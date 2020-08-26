import {
  RemoteAdapter,
  DependenciesAndDependencyManager,
  DependencyManager,
} from '../../remote.types';

export class GitlabAdapter implements RemoteAdapter {
  async getDependenciesAndDependencyManager(
    repositoryUrl: string,
  ): Promise<DependenciesAndDependencyManager> {
    return {
      dependencies: [{ name: 'gitlab', version: '1.2.3' }],
      dependencyManager: DependencyManager.NpmOrYarn,
    };
  }
}
