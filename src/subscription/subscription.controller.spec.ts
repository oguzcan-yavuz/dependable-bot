import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { Subscription } from './schema/subscription.schema';
import { getModelToken } from '@nestjs/mongoose';
import { SubscriptionRepository } from './subscription.repository';
import { RemoteService } from '../remote/remote.service';
import { ContextIdFactory } from '@nestjs/core';

describe('Subscription Controller', () => {
  let controller: SubscriptionController;
  let service: SubscriptionService;

  beforeEach(async () => {
    const mockedSubscriptionModel = {
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubscriptionController],
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

    const contextId = ContextIdFactory.create();
    jest
      .spyOn(ContextIdFactory, 'getByRequest')
      .mockImplementation(() => contextId);

    controller = await module.resolve<SubscriptionController>(
      SubscriptionController,
      contextId,
    );
    service = await module.resolve<SubscriptionService>(
      SubscriptionService,
      contextId,
    );
  });

  it('should create subscription', async () => {
    const dto = {
      repositoryUrl: 'https://github.com/oguzcan-yavuz/nestjs-task-management',
      emails: ['oguzcanyavuz321@gmail.com', 'random@example.com'],
    };
    const spy = jest.spyOn(service, 'createSubscription');

    await controller.createSubscription(dto);

    expect(spy).toHaveBeenCalledWith(dto);
  });
});
