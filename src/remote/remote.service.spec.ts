import { Test, TestingModule } from '@nestjs/testing';
import { RemoteService } from './remote.service';
import { mock, instance, when, anyString, verify, reset } from 'ts-mockito';
import { GitlabAdapter } from './adapters/gitlab.adapter';
import { GithubAdapter } from './adapters/github.adapter';

describe('RemoteService', () => {
  describe('with GithubAdapter', () => {
    let service: RemoteService;
    let mockedGithubAdapter: GithubAdapter;

    beforeEach(async () => {
      mockedGithubAdapter = mock(GithubAdapter);

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          RemoteService,
          {
            provide: 'REMOTE_ADAPTER',
            useValue: instance(mockedGithubAdapter),
          },
        ],
      }).compile();

      service = await module.resolve<RemoteService>(RemoteService);
    });

    afterEach(() => {
      reset(mockedGithubAdapter);
    });

    it('should get dependencies for github provider', async () => {
      const repositoryUrl =
        'https://github.com/oguzcan-yavuz/nestjs-task-management';
      const expectedDependencies = [
        { name: 'mocked-github', version: '1.4.3' },
      ];

      when(mockedGithubAdapter.getDependencies(anyString())).thenResolve(
        expectedDependencies,
      );

      const dependencies = await service.getDependencies(repositoryUrl);

      verify(mockedGithubAdapter.getDependencies(anyString())).times(1);
      expect(dependencies).toEqual(expectedDependencies);
    });
  });

  describe('with GitlabAdapter', () => {
    let service: RemoteService;
    let mockedGitlabAdapter: GitlabAdapter;

    beforeEach(async () => {
      mockedGitlabAdapter = mock(GitlabAdapter);

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          RemoteService,
          {
            provide: 'REMOTE_ADAPTER',
            useValue: instance(mockedGitlabAdapter),
          },
        ],
      }).compile();

      service = await module.resolve<RemoteService>(RemoteService);
    });

    afterEach(() => {
      reset(mockedGitlabAdapter);
    });

    it('should get dependencies for gitlab provider', async () => {
      const repositoryUrl =
        'https://gitlab.com/oguzcan-yavuz/nestjs-task-management';
      const expectedDependencies = [
        { name: 'mocked-gitlab', version: '2.8.7' },
      ];

      when(mockedGitlabAdapter.getDependencies(anyString())).thenResolve(
        expectedDependencies,
      );

      const dependencies = await service.getDependencies(repositoryUrl);

      verify(mockedGitlabAdapter.getDependencies(anyString())).times(1);
      expect(dependencies).toEqual(expectedDependencies);
    });
  });
});
