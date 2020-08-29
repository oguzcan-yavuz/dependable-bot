import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionService } from './subscription.service';
import { getModelToken } from '@nestjs/mongoose';
import { Subscription } from './schema/subscription.schema';
import { SubscriptionRepository } from './subscription.repository';
import {
  SubscriptionEntity,
  SubscriptionQueue,
  SubscriptionJobs,
} from './subscription.types';
import { RemoteService } from '../remote/remote.service';
import { RegistryAdapterFactory } from '../remote/registry.provider';
import { mock, instance, when, anyString, reset, verify } from 'ts-mockito';
import { OutdatedDependency, RemoteProvider } from '../remote/remote.types';
import InvalidRemoteProviderException from './exceptions/invalid-remote-provider.exception';
import { RemoteAdapterFactory } from '../remote/remote.provider';
import { EmailQueue, EmailJobs } from '../email/email.types';
import { Job } from 'bull';
import * as ms from 'ms';

describe('SubscriptionService', () => {
  let service: SubscriptionService;
  let repository: SubscriptionRepository;
  let mockedSubscriptionModel;
  let mockedSubscription: SubscriptionEntity;
  let mockedRemoteService: RemoteService;
  let mockedSubscriptionQueue;
  let mockedEmailQueue;

  beforeEach(async () => {
    mockedSubscription = {
      _id: '507f1f77bcf86cd799439011',
      repositoryUrl: 'https://github.com/oguzcan-yavuz/nestjs-task-management',
      emails: ['oguzcanyavuz321@gmail.com', 'random@example.com'],
      remoteProvider: RemoteProvider.Github,
    };
    mockedSubscriptionModel = {
      create: jest.fn().mockResolvedValue(mockedSubscription),
      findById: jest.fn().mockImplementation(() => ({
        lean: jest.fn().mockResolvedValue(mockedSubscription),
      })),
    };
    mockedRemoteService = mock(RemoteService);
    mockedSubscriptionQueue = {
      add: jest.fn().mockResolvedValue(null),
    };
    mockedEmailQueue = {
      add: jest.fn().mockResolvedValue(null),
    };

    when(
      mockedRemoteService.getOutdatedDependencies(anyString(), anyString()),
    ).thenResolve([]);

    const module: TestingModule = await Test.createTestingModule({
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
          useValue: mockedSubscriptionQueue,
        },
        {
          provide: `BullQueue_${EmailQueue}`,
          useValue: mockedEmailQueue,
        },
      ],
    })
      .overrideProvider(RemoteService)
      .useValue(instance(mockedRemoteService))
      .compile();

    service = await module.resolve<SubscriptionService>(SubscriptionService);
    repository = module.get<SubscriptionRepository>(SubscriptionRepository);
  });

  afterEach(() => {
    reset(mockedRemoteService);
  });

  it('should throw InvalidRemoteProviderException', () => {
    const dto = {
      repositoryUrl: 'https://invalidremote.com/some/repo',
      emails: mockedSubscription.emails,
    };

    expect(async () => await service.createSubscription(dto)).rejects.toThrow(
      InvalidRemoteProviderException,
    );
  });

  it('should create subscription', async () => {
    const dto = {
      repositoryUrl: mockedSubscription.repositoryUrl,
      emails: mockedSubscription.emails,
    };
    const repositorySpy = jest.spyOn(repository, 'create');
    const subscriptionQueueSpy = jest.spyOn(mockedSubscriptionQueue, 'add');
    const subscription = await service.createSubscription(dto);

    expect(repositorySpy).toHaveBeenCalledWith({
      ...dto,
      remoteProvider: RemoteProvider.Github,
    });
    expect(subscriptionQueueSpy).toHaveBeenCalledWith(
      SubscriptionJobs.checkOutdatedDependencies,
      {
        subscriptionId: subscription._id,
      },
    );
    expect(subscription).toEqual(mockedSubscription);
  });

  it('should get subscription', async () => {
    const subscription = await service.getSubscription(mockedSubscription._id);

    expect(subscription).toEqual(mockedSubscription);
  });

  it('should check outdated dependencies', async () => {
    const outdatedDependencies: OutdatedDependency[] = [
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
    const reportOutdatedDependenciesSpy = jest.spyOn(
      service,
      'reportOutdatedDependencies',
    );
    when(
      mockedRemoteService.getOutdatedDependencies(
        mockedSubscription.repositoryUrl,
        RemoteProvider.Github,
      ),
    ).thenResolve(outdatedDependencies);
    const subscriptionQueueSpy = jest.spyOn(mockedSubscriptionQueue, 'add');

    await service.checkOutdatedDependencies({
      data: { subscriptionId: mockedSubscription._id },
    } as Job);

    expect(subscriptionQueueSpy).toHaveBeenCalledWith(
      SubscriptionJobs.checkOutdatedDependencies,
      { subscriptionId: mockedSubscription._id },
      { delay: ms('1 day') },
    );
    verify(
      mockedRemoteService.getOutdatedDependencies(
        mockedSubscription.repositoryUrl,
        RemoteProvider.Github,
      ),
    ).times(1);
    expect(reportOutdatedDependenciesSpy).toHaveBeenCalledWith(
      mockedSubscription._id,
      outdatedDependencies,
    );
  });

  it('should report outdated dependencies', async () => {
    const outdatedDependencies: OutdatedDependency[] = [
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
    const emailQueueSpy = jest.spyOn(mockedEmailQueue, 'add');

    await service.reportOutdatedDependencies(
      mockedSubscription._id,
      outdatedDependencies,
    );

    expect(emailQueueSpy).toHaveBeenCalledWith(EmailJobs.sendEmail, {
      to: mockedSubscription.emails[0],
      title: 'New outdated dependency!',
      message: `You can update ${outdatedDependencies[0].name} from ${outdatedDependencies[0].version} to ${outdatedDependencies[0].latestVersion}`,
    });
    expect(emailQueueSpy).toHaveBeenCalledWith(EmailJobs.sendEmail, {
      to: mockedSubscription.emails[1],
      title: 'New outdated dependency!',
      message: `You can update ${outdatedDependencies[0].name} from ${outdatedDependencies[0].version} to ${outdatedDependencies[0].latestVersion}`,
    });
    expect(emailQueueSpy).toHaveBeenCalledWith(EmailJobs.sendEmail, {
      to: mockedSubscription.emails[0],
      title: 'New outdated dependency!',
      message: `You can update ${outdatedDependencies[1].name} from ${outdatedDependencies[1].version} to ${outdatedDependencies[1].latestVersion}`,
    });
    expect(emailQueueSpy).toHaveBeenCalledWith(EmailJobs.sendEmail, {
      to: mockedSubscription.emails[1],
      title: 'New outdated dependency!',
      message: `You can update ${outdatedDependencies[1].name} from ${outdatedDependencies[1].version} to ${outdatedDependencies[1].latestVersion}`,
    });
  });
});
