import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { Subscription } from './schema/subscription.schema';
import { getModelToken } from '@nestjs/mongoose';
import { SubscriptionRepository } from './subscription.repository';
import { RemoteService } from '../remote/remote.service';
import { ContextIdFactory } from '@nestjs/core';
import { SubscriptionEntity, SubscriptionQueue } from './subscription.types';
import { RegistryAdapterFactory } from '../remote/registry.provider';
import { RemoteProvider } from '../remote/remote.types';
import { RemoteAdapterFactory } from '../remote/remote.provider';
import { EmailQueue } from '../email/email.types';

describe('Subscription Controller', () => {
  let controller: SubscriptionController;
  let service: SubscriptionService;
  let mockedSubscription: SubscriptionEntity;

  beforeEach(async () => {
    mockedSubscription = {
      _id: '507f1f77bcf86cd799439011',
      repositoryUrl: 'https://github.com/oguzcan-yavuz/nestjs-task-management',
      emails: ['oguzcanyavuz321@gmail.com', 'random@example.com'],
      remoteProvider: RemoteProvider.Github,
    };
    const mockedSubscriptionModel = {
      create: jest.fn().mockResolvedValue(mockedSubscription),
      findById: jest.fn().mockImplementation(() => ({
        lean: jest.fn().mockResolvedValue(mockedSubscription),
      })),
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
        RemoteAdapterFactory,
        RegistryAdapterFactory,
        {
          provide: `BullQueue_${SubscriptionQueue}`,
          useValue: { add: jest.fn() },
        },
        {
          provide: `BullQueue_${EmailQueue}`,
          useValue: { add: jest.fn() },
        },
      ],
    })
      .overrideProvider(RemoteAdapterFactory)
      .useFactory({ factory: () => {} })
      .overrideProvider(RegistryAdapterFactory)
      .useFactory({ factory: () => {} })
      .compile();

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
      repositoryUrl: mockedSubscription.repositoryUrl,
      emails: mockedSubscription.emails,
    };
    const createSubscriptionSpy = jest.spyOn(service, 'createSubscription');

    const { id } = await controller.createSubscription(dto);

    expect(createSubscriptionSpy).toHaveBeenCalledWith(dto);
    expect(id).toBe(mockedSubscription._id);
  });
});
