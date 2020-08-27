import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { Subscription } from './schema/subscription.schema';
import { getModelToken } from '@nestjs/mongoose';
import { SubscriptionRepository } from './subscription.repository';
import { RemoteService } from '../remote/remote.service';
import { ContextIdFactory } from '@nestjs/core';
import { NestEmitterModule } from 'nest-emitter';
import { EventEmitter } from 'events';
import { SubscriptionEntity } from './subscription.types';
import { RegistryAdapterFactory } from '../remote/registry.provider';

describe('Subscription Controller', () => {
  let controller: SubscriptionController;
  let service: SubscriptionService;
  let mockedSubscription: SubscriptionEntity;

  beforeEach(async () => {
    mockedSubscription = {
      _id: '507f1f77bcf86cd799439011',
      repositoryUrl: 'https://github.com/oguzcan-yavuz/nestjs-task-management',
      emails: ['oguzcanyavuz321@gmail.com', 'random@example.com'],
    };
    const mockedSubscriptionModel = {
      create: jest.fn().mockResolvedValue(mockedSubscription),
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [NestEmitterModule.forRoot(new EventEmitter())],
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
        RegistryAdapterFactory,
      ],
    })
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
    const spy = jest.spyOn(service, 'createSubscription');

    const { id } = await controller.createSubscription(dto);

    expect(spy).toHaveBeenCalledWith(dto);
    expect(id).toBe(mockedSubscription._id);
  });
});
