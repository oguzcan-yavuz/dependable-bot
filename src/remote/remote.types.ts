export type DependencyMap = Map<string, string>;

export interface RemoteAdapter {
  getDependencies(repositoryUrl: string): Promise<DependencyMap>;
}

export type RemoteProviderToAdapterMap = Record<string, RemoteAdapter>;
