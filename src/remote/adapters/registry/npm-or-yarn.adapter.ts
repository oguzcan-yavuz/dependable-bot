import { RegistryAdapter } from '../../remote.types';
import axios from 'axios';

export class NpmOrYarnAdapter implements RegistryAdapter {
  private baseUrl = 'http://registry.npmjs.org';

  async getLatestVersion(dependencyName: string): Promise<string> {
    const {
      data: { version },
    } = await axios.get([this.baseUrl, dependencyName, 'latest'].join('/'));

    return version;
  }
}
