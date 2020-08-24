import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionService } from './subscription.service';
import { getModelToken } from '@nestjs/mongoose';
import { Subscription } from './schema/subscription.schema';
import { SubscriptionRepository } from './subscription.repository';
import { SubscriptionEntity } from './subscription.types';
import { RemoteRepositoryProvider } from '../remote/remote.types';
import { RemoteService } from '../remote/remote.service';

describe('SubscriptionService', () => {
  let service: SubscriptionService;
  let repository: SubscriptionRepository;
  let mockSubscriptionModel;
  let mockSubscription: SubscriptionEntity;

  beforeEach(async () => {
    mockSubscription = {
      _id: '507f1f77bcf86cd799439011',
      repositoryUrl: 'https://github.com/oguzcan-yavuz/nestjs-task-management',
      emails: ['oguzcanyavuz321@gmail.com', 'random@example.com'],
      remoteRepositoryProvider: RemoteRepositoryProvider.Github,
    };
    mockSubscriptionModel = {
      create: jest.fn().mockResolvedValue(mockSubscription),
      findById: jest.fn().mockImplementation(() => ({
        lean: jest.fn().mockResolvedValue(mockSubscription),
      })),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionService,
        SubscriptionRepository,
        {
          provide: getModelToken(Subscription.name),
          useValue: mockSubscriptionModel,
        },
        RemoteService,
      ],
    }).compile();

    service = module.get<SubscriptionService>(SubscriptionService);
    repository = module.get<SubscriptionRepository>(SubscriptionRepository);
  });

  it('should create subscription', async () => {
    const dto = {
      repositoryUrl: 'https://github.com/oguzcan-yavuz/nestjs-task-management',
      emails: ['oguzcanyavuz321@gmail.com', 'random@example.com'],
    };
    const spy = jest.spyOn(repository, 'create');

    const subscription = await service.createSubscription(dto);

    expect(spy).toHaveBeenCalledWith({
      ...dto,
      remoteRepositoryProvider: RemoteRepositoryProvider.Github,
    });
    expect(subscription).toEqual(mockSubscription);
  });

  xit('should get outdated dependencies', async () => {
    const subscriptionId = '507f1f77bcf86cd799439011';
    const mockOutdatedDependencies = [
      {
        name: 'very-important-package',
        currentVersion: '0.3.5',
        latestVersion: '0.7.8',
      },
      {
        name: 'not-so-important-package',
        currentVersion: '1.2.3',
        latestVersion: '3.5.10',
      },
    ];

    const outdatedDependencies = await service.getOutdatedDependencies(
      subscriptionId,
    );

    expect(outdatedDependencies).toEqual(mockOutdatedDependencies);
  });
});
