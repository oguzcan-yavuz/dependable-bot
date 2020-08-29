import { RegistryAdapter } from './adapters/registry/registry-adapter.interface';
import { RemoteAdapter } from './adapters/remote/remote-adapter.interface';

export enum DependencyManager {
  NpmOrYarn = 'npmOrYarn',
  Composer = 'composer',
}

export enum RemoteProvider {
  Github = 'github',
  Gitlab = 'gitlab',
}

export type Dependency = {
  name: string;
  version: string;
};

export type RemoteProviderToAdapterMap = Record<RemoteProvider, RemoteAdapter>;

export type OutdatedDependency = Dependency & { latestVersion: string };

export type DependencyManagerToAdapterMap = Record<
  DependencyManager,
  RegistryAdapter
>;

export type DependencyManagerAndPackageFile = {
  dependencyManager: DependencyManager | undefined;
  packageFile: string | undefined;
};
