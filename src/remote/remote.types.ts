export enum DependencyManager {
  NpmOrYarn = 'npmOrYarn',
  Composer = 'composer',
}

export type DependenciesAndDependencyManager = {
  dependencies: Dependency[];
  dependencyManager: DependencyManager;
};

export type Dependency = {
  name: string;
  version: string;
};

export interface RemoteAdapter {
  getDependenciesAndDependencyManager(
    repositoryUrl: string,
  ): Promise<DependenciesAndDependencyManager>;
}

export interface RegistryAdapter {
  getLatestVersion(dependencyName: string): Promise<string>;
}

export type RemoteProviderToAdapterMap = Record<string, RemoteAdapter>;

export type OutdatedDependency = Dependency & { latestVersion: string };

export type DependencyManagerToAdapterMap = Record<
  DependencyManager,
  RegistryAdapter
>;
