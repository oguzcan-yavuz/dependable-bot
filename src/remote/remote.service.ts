import { Injectable, Scope, Inject } from '@nestjs/common';
import { RemoteAdapter, OutdatedDependency } from './remote.types';
import { RegistryAdapterFactory } from './registry.provider';

@Injectable({
  scope: Scope.REQUEST,
})
export class RemoteService {
  constructor(
    @Inject('REMOTE_ADAPTER')
    private remoteAdapter: RemoteAdapter,
    private registryAdapterFactory: RegistryAdapterFactory,
  ) {}

  async getOutdatedDependencies(
    repositoryUrl: string,
  ): Promise<OutdatedDependency[]> {
    const {
      dependencies: currentDependencies,
      dependencyManager,
    } = await this.remoteAdapter.getDependenciesAndDependencyManager(
      repositoryUrl,
    );
    const registryAdapter = this.registryAdapterFactory.getAdapter(
      dependencyManager,
    );
    const latestVersions = await Promise.all(
      currentDependencies.map(({ name }) =>
        registryAdapter.getLatestVersion(name),
      ),
    );
    const dependenciesWithBothVersions = currentDependencies.map(
      (dependency, index) => ({
        ...dependency,
        latestVersion: latestVersions[index],
      }),
    );

    const outdatedDependencies = dependenciesWithBothVersions.filter(
      dependency => dependency.version !== dependency.latestVersion,
    );

    return outdatedDependencies;
  }
}
