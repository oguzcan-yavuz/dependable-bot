import { Injectable } from '@nestjs/common';
import {
  DependencyManager,
  RegistryAdapter,
  DependencyManagerToAdapterMap,
} from './remote.types';
import { NpmOrYarnAdapter } from './adapters/registry/npm-or-yarn.adapter';
import { ComposerAdapter } from './adapters/registry/composer.adapter';

@Injectable()
export class RegistryAdapterFactory {
  getAdapter(dependencyManager: DependencyManager): RegistryAdapter {
    const dependencyManagerToAdapterMap: DependencyManagerToAdapterMap = {
      [DependencyManager.NpmOrYarn]: new NpmOrYarnAdapter(),
      [DependencyManager.Composer]: new ComposerAdapter(),
    };

    const registryAdapter = dependencyManagerToAdapterMap[dependencyManager];

    return registryAdapter;
  }
}
