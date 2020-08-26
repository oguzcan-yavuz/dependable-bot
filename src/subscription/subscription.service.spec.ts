import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionService } from './subscription.service';
import { getModelToken } from '@nestjs/mongoose';
import { Subscription } from './schema/subscription.schema';
import { SubscriptionRepository } from './subscription.repository';
import { SubscriptionEntity } from './subscription.types';
import { RemoteService } from '../remote/remote.service';
import { SubscriptionEventEmitter } from './subscription.events';
import { EventEmitter } from 'events';
import { NestEmitterModule } from 'nest-emitter';
import { RegistryAdapterFactory } from '../remote/registry.provider';
import { mock, instance, when, anyString, reset, verify } from 'ts-mockito';
import { OutdatedDependency } from '../remote/remote.types';

describe('SubscriptionService', () => {
  let service: SubscriptionService;
  let repository: SubscriptionRepository;
  let mockedSubscriptionModel;
  let mockedSubscription: SubscriptionEntity;
  let eventEmitter: SubscriptionEventEmitter;
  let mockedRemoteService: RemoteService;

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
    mockedRemoteService = mock(RemoteService);

    when(mockedRemoteService.getOutdatedDependencies(anyString())).thenResolve(
      [],
    );

    const module: TestingModule = await Test.createTestingModule({
      imports: [NestEmitterModule.forRoot(new EventEmitter())],
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
      .overrideProvider(RemoteService)
      .useValue(instance(mockedRemoteService))
      .compile();

    service = await module.resolve<SubscriptionService>(SubscriptionService);
    service.onModuleInit();
    repository = module.get<SubscriptionRepository>(SubscriptionRepository);
    eventEmitter = module.get<SubscriptionEventEmitter>('__event_emitter__');
  });

  afterEach(() => {
    reset(mockedRemoteService);
  });

  it('should create subscription', async () => {
    const dto = {
      repositoryUrl: mockedSubscription.repositoryUrl,
      emails: mockedSubscription.emails,
    };
    const repositorySpy = jest.spyOn(repository, 'create');
    const emitterSpy = jest.spyOn(eventEmitter, 'emit');
    const subscription = await service.createSubscription(dto);

    expect(repositorySpy).toHaveBeenCalledWith(dto);
    expect(emitterSpy).toHaveBeenCalledWith(
      'newSubscription',
      subscription._id,
    );
    expect(subscription).toEqual(mockedSubscription);
  });

  it('should get subscription', async () => {
    const subscription = await service.getSubscription(mockedSubscription._id);

    expect(subscription).toEqual(mockedSubscription);
  });

  it('should listen newSubscription event', async () => {
    const dto = {
      repositoryUrl: mockedSubscription.repositoryUrl,
      emails: mockedSubscription.emails,
    };

    const emitterSpy = jest.spyOn(eventEmitter, 'emit');
    const listenerSpy = jest.spyOn(service, 'checkOutdatedDependencies');
    const subscription = await service.createSubscription(dto);

    expect(emitterSpy).toHaveBeenCalledWith(
      'newSubscription',
      subscription._id,
    );
    expect(listenerSpy).toHaveBeenCalledWith(subscription._id);
  });

  it('should emit newOutdatedDependencies', async () => {
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
    const emitterSpy = jest.spyOn(eventEmitter, 'emit');
    when(
      mockedRemoteService.getOutdatedDependencies(
        mockedSubscription.repositoryUrl,
      ),
    ).thenResolve(expectedOutdatedDependencies);

    const outdatedDependencies = await service.checkOutdatedDependencies(
      mockedSubscription._id,
    );

    verify(
      mockedRemoteService.getOutdatedDependencies(
        mockedSubscription.repositoryUrl,
      ),
    ).times(1);
    expect(emitterSpy).toHaveBeenCalledWith('newOutdatedDependencies', {
      subscriptionId: mockedSubscription._id,
      outdatedDependencies,
    });
    expect(outdatedDependencies).toEqual(expectedOutdatedDependencies);
  });
});
