import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionService } from './subscription.service';
import { getModelToken } from '@nestjs/mongoose';
import { Subscription } from './schema/subscription.schema';
import { SubscriptionRepository } from './subscription.repository';
import { SubscriptionEntity } from './subscription.types';
import { RemoteService } from '../remote/remote.service';

describe('SubscriptionService', () => {
  let service: SubscriptionService;
  let repository: SubscriptionRepository;
  let mockedSubscriptionModel;
  let mockedSubscription: SubscriptionEntity;

  beforeEach(async () => {
    mockedSubscription = {
      _id: '507f1f77bcf86cd799439011',
      repositoryUrl: 'https://github.com/oguzcan-yavuz/nestjs-task-management',
      emails: ['oguzcanyavuz321@gmail.com', 'random@example.com'],
    };
    mockedSubscriptionModel = {
      create: jest.fn().mockResolvedValue(mockedSubscription),
      findById: jest.fn().mockImplementation(() => ({
        lean: jest.fn().mockResolvedValue(mockedSubscription),
      })),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionService,
        SubscriptionRepository,
        {
          provide: getModelToken(Subscription.name),
          useValue: mockedSubscriptionModel,
        },
        RemoteService,
        {
          provide: 'REMOTE_ADAPTER',
          useValue: {},
        },
      ],
    }).compile();

    service = await module.resolve<SubscriptionService>(SubscriptionService);
    repository = module.get<SubscriptionRepository>(SubscriptionRepository);
  });

  it('should create subscription', async () => {
    const dto = {
      repositoryUrl: 'https://github.com/oguzcan-yavuz/nestjs-task-management',
      emails: ['oguzcanyavuz321@gmail.com', 'random@example.com'],
    };
    const spy = jest.spyOn(repository, 'create');

    const subscription = await service.createSubscription(dto);

    expect(spy).toHaveBeenCalledWith(dto);
    expect(subscription).toEqual(mockedSubscription);
  });
});
