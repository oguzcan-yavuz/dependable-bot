import { RegistryAdapter } from './adapters/registry/registry-adapter.interface';
import { RemoteAdapter } from './adapters/remote/remote-adapter.interface';
import { ApiProperty } from '@nestjs/swagger';

export enum DependencyManager {
  NpmOrYarn = 'npmOrYarn',
  Composer = 'composer',
}

export enum RemoteProvider {
  Github = 'github',
  Gitlab = 'gitlab',
}

export class Dependency {
  @ApiProperty({
    example: 'axios',
    description: 'Name of the package',
  })
  name: string;

  @ApiProperty({
    example: 'v2.3.8',
    description: 'Current version of the package',
  })
  version: string;
}

export type RemoteProviderToAdapterMap = Record<RemoteProvider, RemoteAdapter>;

export class OutdatedDependency extends Dependency {
  @ApiProperty({
    example: 'v4.0.0',
    description: 'Latest version of the package',
  })
  latestVersion: string;
}

export type DependencyManagerToAdapterMap = Record<
  DependencyManager,
  RegistryAdapter
>;

export type DependencyManagerAndPackageFile = {
  dependencyManager: DependencyManager | undefined;
  packageFile: string | undefined;
};
