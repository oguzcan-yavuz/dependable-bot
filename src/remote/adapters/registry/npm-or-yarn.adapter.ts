import { Dependency } from '../../remote.types';
import { mapToDependency } from '../../remote.util';
import { RegistryAdapter } from './registry-adapter.interface';
import axios from 'axios';

export class NpmOrYarnAdapter implements RegistryAdapter {
  private baseUrl = 'http://registry.npmjs.org';

  async getLatestVersion(dependencyName: string): Promise<string> {
    const {
      data: { version },
    } = await axios.get([this.baseUrl, dependencyName, 'latest'].join('/'));

    return version;
  }

  formatContents(contents: string): Dependency[] {
    const packageJson = JSON.parse(contents);
    const dependencies = mapToDependency(packageJson.dependencies);
    const devDependencies = mapToDependency(packageJson.devDependencies);

    return [...dependencies, ...devDependencies];
  }
}
