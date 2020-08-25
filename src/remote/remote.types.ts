export type Dependency = {
  name: string;
  version: string;
};

export interface RemoteAdapter {
  getDependencies(repositoryUrl: string): Promise<Dependency[]>;
}

export type RemoteProviderToAdapterMap = Record<string, RemoteAdapter>;
