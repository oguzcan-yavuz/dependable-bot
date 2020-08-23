import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionService } from './subscription.service';
import { getModelToken } from '@nestjs/mongoose';
import { Subscription } from './schema/subscription.schema';
import { SubscriptionRepository } from './subscription.repository';

describe('SubscriptionService', () => {
  let service: SubscriptionService;
  let repository: SubscriptionRepository;
  let mockSubscriptionModel;

  beforeEach(async () => {
    mockSubscriptionModel = {
      create: jest.fn().mockImplementation(dto => Promise.resolve(dto)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionService,
        SubscriptionRepository,
        {
          provide: getModelToken(Subscription.name),
          useValue: mockSubscriptionModel,
        },
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

    expect(spy).toHaveBeenCalledWith(dto);
    expect(subscription).toEqual(dto);
  });
});
