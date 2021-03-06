import { Dependency } from '../../remote.types';
import { mapToDependency } from '../../remote.util';
import { RegistryAdapter } from './registry-adapter.interface';
import axios from 'axios';

export class ComposerAdapter implements RegistryAdapter {
  private baseUrl = 'https://packagist.org';

  private getNumericVersion(version: string): number {
    return Number(version.replace(/[^\d]/g, '').slice(0, 3));
  }

  private sortVersions(versions: string[]): string[] {
    const versionPattern = new RegExp(/^[\d\.v]+$/);

    return versions
      .filter(version => versionPattern.test(version))
      .sort((a, b) => {
        const aNumeric = this.getNumericVersion(a);
        const bNumeric = this.getNumericVersion(b);

        return aNumeric - bNumeric;
      });
  }

  async getLatestVersion(dependencyName: string): Promise<string> {
    const {
      data: {
        package: { versions },
      },
    } = await axios.get(
      [this.baseUrl, 'packages', `${dependencyName}.json`].join('/'),
    );
    const [latestVersion] = this.sortVersions(Object.keys(versions)).slice(-1);

    return latestVersion;
  }

  formatContents(contents: string): Dependency[] {
    const composerJson = JSON.parse(contents);
    const require = mapToDependency(composerJson.require);
    const requireDev = mapToDependency(composerJson['require-dev']);

    return [...require, ...requireDev];
  }
}
