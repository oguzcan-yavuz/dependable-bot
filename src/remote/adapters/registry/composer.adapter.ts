import { RegistryAdapter } from '../../remote.types';

export class ComposerAdapter implements RegistryAdapter {
  async getLatestVersion(dependencyName: string): Promise<string> {
    return '9.8.7';
  }
}
