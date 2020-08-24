import { Test, TestingModule } from '@nestjs/testing';
import { RemoteService } from './remote.service';
import { BadRequestException } from '@nestjs/common';
import { RemoteRepositoryProvider } from './remote.types';

describe('RemoteService', () => {
  let service: RemoteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RemoteService],
    }).compile();

    service = module.get<RemoteService>(RemoteService);
  });

  it('should throw for invalid remote repository type', () => {
    const repositoryUrl =
      'https://invalidgitrepo.com/oguzcan-yavuz/nestjs-task-management';

    expect(() => service.getRemoteRepositoryProvider(repositoryUrl)).toThrow(
      BadRequestException,
    );
  });

  it('should get remote repository type', () => {
    const repositoryUrl =
      'https://github.com/oguzcan-yavuz/nestjs-task-management';

    const remoteRepositoryProvider = service.getRemoteRepositoryProvider(
      repositoryUrl,
    );

    expect(remoteRepositoryProvider).toBe(RemoteRepositoryProvider.Github);
  });
});
