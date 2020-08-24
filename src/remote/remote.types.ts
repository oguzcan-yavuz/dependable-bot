import { ValueOf } from '../app.types';

export const PackageManager = {
  NpmOrYarn: 'npmOrYarn',
  Composer: 'composer',
};

export const RemoteRepositoryProvider = {
  Github: 'github.com',
};

export type ValueOfRemoteRepositoryProvider = ValueOf<
  typeof RemoteRepositoryProvider
>;

export type ValueOfPackageManager = ValueOf<typeof PackageManager>;
