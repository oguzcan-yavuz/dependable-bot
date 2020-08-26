import { RegistryAdapter } from '../../remote.types';

export class NpmOrYarnAdapter implements RegistryAdapter {
  async getLatestVersion(dependencyName: string): Promise<string> {
    return '3.8.7';
  }
}
