import { Test, TestingModule } from '@nestjs/testing';
import { RemoteService } from './remote.service';
import { mock, instance, when, anyString, verify, reset } from 'ts-mockito';
import { GithubAdapter } from './adapters/remote/github.adapter';
import {
  DependencyManager,
  OutdatedDependency,
  RemoteProvider,
} from './remote.types';
import { RegistryAdapterFactory } from './registry.provider';
import { NpmOrYarnAdapter } from './adapters/registry/npm-or-yarn.adapter';
import { ComposerAdapter } from './adapters/registry/composer.adapter';
import InvalidDependencyManagerException from './exceptions/invalid-dependency-manager.exception';
import { RemoteAdapterFactory } from './remote.provider';

describe('RemoteService', () => {
  describe('with GithubAdapter', () => {
    let service: RemoteService;
    let mockedRemoteAdapterFactory: RemoteAdapterFactory;
    let mockedGithubAdapter: GithubAdapter;
    let mockedRegistryAdapterFactory: RegistryAdapterFactory;
    let mockedNpmOrYarnAdapter: NpmOrYarnAdapter;
    let mockedComposerAdapter: ComposerAdapter;

    beforeEach(async () => {
      mockedRemoteAdapterFactory = mock(RemoteAdapterFactory);
      mockedGithubAdapter = mock(GithubAdapter);
      mockedRegistryAdapterFactory = mock(RegistryAdapterFactory);
      mockedNpmOrYarnAdapter = mock(NpmOrYarnAdapter);
      mockedComposerAdapter = mock(ComposerAdapter);

      when(
        mockedRemoteAdapterFactory.getAdapter(RemoteProvider.Github),
      ).thenReturn(instance(mockedGithubAdapter));
      when(
        mockedRegistryAdapterFactory.getAdapter(DependencyManager.NpmOrYarn),
      ).thenReturn(instance(mockedNpmOrYarnAdapter));
      when(
        mockedRegistryAdapterFactory.getAdapter(DependencyManager.Composer),
      ).thenReturn(instance(mockedComposerAdapter));

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          RemoteService,
          {
            provide: 'REMOTE_ADAPTER',
            useValue: instance(mockedGithubAdapter),
          },
          RemoteAdapterFactory,
          RegistryAdapterFactory,
        ],
      })
        .overrideProvider(RemoteAdapterFactory)
        .useValue(instance(mockedRemoteAdapterFactory))
        .overrideProvider(RegistryAdapterFactory)
        .useValue(instance(mockedRegistryAdapterFactory))
        .compile();

      service = await module.resolve<RemoteService>(RemoteService);
    });

    afterEach(() => {
      reset(mockedGithubAdapter);
      reset(mockedRegistryAdapterFactory);
      reset(mockedNpmOrYarnAdapter);
      reset(mockedComposerAdapter);
    });

    it('should throw InvalidDependencyManagerException', async () => {
      const repositoryUrl =
        'https://github.com/oguzcan-yavuz/nestjs-task-management';
      when(mockedGithubAdapter.getFileNames(repositoryUrl)).thenResolve([]);

      expect(
        async () =>
          await service.getOutdatedDependencies(
            repositoryUrl,
            RemoteProvider.Github,
          ),
      ).rejects.toThrow(InvalidDependencyManagerException);
    });

    it('should get outdated dependencies', async () => {
      const repositoryUrl =
        'https://github.com/oguzcan-yavuz/nestjs-task-management';
      const expectedOutdatedDependencies: OutdatedDependency[] = [
        {
          name: 'dependency-one',
          version: '1.2.3',
          latestVersion: '9.9.9',
        },
        {
          name: 'dependency-two',
          version: '3.4.7',
          latestVersion: '9.9.9',
        },
      ];

      when(mockedGithubAdapter.getFileNames(repositoryUrl)).thenResolve([
        'index.js',
        'package.json',
        'package-lock.json',
      ]);
      when(
        mockedGithubAdapter.getFileContents(repositoryUrl, 'package.json'),
      ).thenResolve(
        JSON.stringify({
          dependencies: {
            'dependency-one': '^1.2.3',
          },
          devDependencies: {
            'dependency-two': '~3.4.7',
            'dependency-three': '9.9.9',
          },
        }),
      );
      when(mockedNpmOrYarnAdapter.getLatestVersion(anyString())).thenResolve(
        '9.9.9',
      );

      const dependencies = await service.getOutdatedDependencies(
        repositoryUrl,
        RemoteProvider.Github,
      );

      verify(mockedGithubAdapter.getFileNames(repositoryUrl)).times(1);
      verify(
        mockedGithubAdapter.getFileContents(repositoryUrl, 'package.json'),
      ).times(1);
      verify(mockedNpmOrYarnAdapter.getLatestVersion(anyString())).times(3);
      expect(dependencies).toEqual(expectedOutdatedDependencies);
    });
  });
});
