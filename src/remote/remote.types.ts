import { CreateSubscriptionDto } from '../subscription/dto/create-subscription.dto';

export enum DependencyManager {
  NpmOrYarn = 'npmOrYarn',
  Composer = 'composer',
}

export enum RemoteProvider {
  Github = 'github',
  Gitlab = 'gitlab',
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
  getFileNames(repositoryUrl: string): Promise<string[]>;
  getFileContents(repositoryUrl: string, fileName: string): Promise<string>;
}

export interface RegistryAdapter {
  getLatestVersion(dependencyName: string): Promise<string>;
}

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

export type SubscriptionBody = CreateSubscriptionDto & {
  remoteProvider: RemoteProvider;
};
