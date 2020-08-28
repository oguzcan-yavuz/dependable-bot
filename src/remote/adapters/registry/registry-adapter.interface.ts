import { Dependency } from '../../remote.types';

export interface RegistryAdapter {
  getLatestVersion(dependencyName: string): Promise<string>;
  formatContents(contents: string): Dependency[];
}
