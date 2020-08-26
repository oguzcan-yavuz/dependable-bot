import { Test, TestingModule } from '@nestjs/testing';
import { RemoteService } from './remote.service';
import { mock, instance, when, anyString, verify, reset } from 'ts-mockito';
import { GithubAdapter } from './adapters/remote/github.adapter';
import {
  DependencyManager,
  OutdatedDependency,
  DependenciesAndDependencyManager,
} from './remote.types';
import { RegistryAdapterFactory } from './registry.provider';
import { NpmOrYarnAdapter } from './adapters/registry/npm-or-yarn.adapter';
import { ComposerAdapter } from './adapters/registry/composer.adapter';

describe('RemoteService', () => {
  describe('with GithubAdapter', () => {
    let service: RemoteService;
    let mockedGithubAdapter: GithubAdapter;
    let mockedRegistryAdapterFactory: RegistryAdapterFactory;
    let mockedNpmOrYarnAdapter: NpmOrYarnAdapter;
    let mockedComposerAdapter: ComposerAdapter;

    beforeEach(async () => {
      mockedGithubAdapter = mock(GithubAdapter);
      mockedRegistryAdapterFactory = mock(RegistryAdapterFactory);
      mockedNpmOrYarnAdapter = mock(NpmOrYarnAdapter);
      mockedComposerAdapter = mock(ComposerAdapter);

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
          RegistryAdapterFactory,
        ],
      })
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

    it('should get outdated dependencies', async () => {
      const repositoryUrl =
        'https://github.com/oguzcan-yavuz/nestjs-task-management';
      const expectedDependenciesAndDependencyManager: DependenciesAndDependencyManager = {
        dependencies: [
          { name: 'dependency-one', version: '1.2.3' },
          { name: 'dependency-two', version: '3.4.7' },
          { name: 'dependency-three', version: '9.9.9' },
        ],
        dependencyManager: DependencyManager.NpmOrYarn,
      };
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

      when(
        mockedGithubAdapter.getDependenciesAndDependencyManager(anyString()),
      ).thenResolve(expectedDependenciesAndDependencyManager);
      when(mockedNpmOrYarnAdapter.getLatestVersion(anyString())).thenResolve(
        '9.9.9',
      );

      const dependencies = await service.getOutdatedDependencies(repositoryUrl);

      verify(
        mockedGithubAdapter.getDependenciesAndDependencyManager(anyString()),
      ).times(1);
      verify(mockedNpmOrYarnAdapter.getLatestVersion(anyString())).times(3);
      expect(dependencies).toEqual(expectedOutdatedDependencies);
    });
  });
});
