import { Injectable } from '@nestjs/common';
import {
  OutdatedDependency,
  DependencyManager,
  DependencyManagerAndPackageFile,
  Dependency,
  RemoteProvider,
} from './remote.types';
import { RegistryAdapterFactory } from './registry.provider';
import InvalidDependencyManagerException from './exceptions/invalid-dependency-manager.exception';
import { RemoteAdapterFactory } from './remote.provider';

@Injectable()
export class RemoteService {
  constructor(
    private remoteAdapterFactory: RemoteAdapterFactory,
    private registryAdapterFactory: RegistryAdapterFactory,
  ) {}

  private getDependencyManagerAndPackageFile(
    fileNames: string[],
  ): DependencyManagerAndPackageFile {
    const packageFileToDependencyManagerMap = {
      'package.json': DependencyManager.NpmOrYarn,
      'composer.json': DependencyManager.Composer,
    };

    const [packageFile, dependencyManager] =
      Object.entries(packageFileToDependencyManagerMap).find(([packageFile]) =>
        fileNames.includes(packageFile),
      ) || [];

    return { packageFile, dependencyManager };
  }

  private async addLatestVersionToDependencies(
    dependencies: Dependency[],
    dependencyManager: DependencyManager,
  ): Promise<OutdatedDependency[]> {
    const registryAdapter = this.registryAdapterFactory.getAdapter(
      dependencyManager,
    );
    const latestVersions = await Promise.all(
      dependencies.map(({ name, version }) =>
        registryAdapter.getLatestVersion(name).catch(() => version),
      ),
    );
    return dependencies.map((dependency, index) => ({
      ...dependency,
      latestVersion: latestVersions[index],
    }));
  }

  async getOutdatedDependencies(
    repositoryUrl: string,
    remoteProvider: RemoteProvider,
  ): Promise<OutdatedDependency[]> {
    const remoteAdapter = this.remoteAdapterFactory.getAdapter(remoteProvider);
    const fileNames = await remoteAdapter.getFileNames(repositoryUrl);
    const {
      packageFile,
      dependencyManager,
    } = this.getDependencyManagerAndPackageFile(fileNames);
    if (!packageFile || !dependencyManager) {
      throw new InvalidDependencyManagerException();
    }
    const contents = await remoteAdapter.getFileContents(
      repositoryUrl,
      packageFile,
    );
    const registryAdapter = this.registryAdapterFactory.getAdapter(
      dependencyManager,
    );
    const dependencies = registryAdapter.formatContents(contents);
    const dependenciesWithBothVersions = await this.addLatestVersionToDependencies(
      dependencies,
      dependencyManager,
    );
    const outdatedDependencies = dependenciesWithBothVersions.filter(
      dependency => dependency.version !== dependency.latestVersion,
    );

    return outdatedDependencies;
  }
}
