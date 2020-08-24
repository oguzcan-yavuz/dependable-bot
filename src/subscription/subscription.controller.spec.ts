import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { Subscription } from './schema/subscription.schema';
import { getModelToken } from '@nestjs/mongoose';
import { SubscriptionRepository } from './subscription.repository';
import { RemoteService } from '../remote/remote.service';

describe('Subscription Controller', () => {
  let controller: SubscriptionController;
  let service: SubscriptionService;

  beforeEach(async () => {
    const mockSubscriptionModel = {
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubscriptionController],
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

    controller = module.get<SubscriptionController>(SubscriptionController);
    service = module.get<SubscriptionService>(SubscriptionService);
  });

  it('should create subscription', () => {
    const dto = {
      repositoryUrl: 'https://github.com/oguzcan-yavuz/nestjs-task-management',
      emails: ['oguzcanyavuz321@gmail.com', 'random@example.com'],
    };
    const spy = jest.spyOn(service, 'createSubscription');

    controller.createSubscription(dto);

    expect(spy).toHaveBeenCalledWith(dto);
  });
});
