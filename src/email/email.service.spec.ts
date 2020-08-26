import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import { NestEmitterModule } from 'nest-emitter';
import { EventEmitter } from 'events';
import {
  SubscriptionEventEmitter,
  OutdatedDependenciesOfSubscription,
} from '../subscription/subscription.events';
import { SubscriptionService } from '../subscription/subscription.service';
import { mock, instance, when, reset } from 'ts-mockito';

describe('EmailService', () => {
  let service: EmailService;
  let eventEmitter: SubscriptionEventEmitter;
  let mockedSubscriptionService: SubscriptionService;

  beforeEach(async () => {
    mockedSubscriptionService = mock(SubscriptionService);

    const module: TestingModule = await Test.createTestingModule({
      imports: [NestEmitterModule.forRoot(new EventEmitter())],
      providers: [EmailService, SubscriptionService],
    })
      .overrideProvider(SubscriptionService)
      .useValue(instance(mockedSubscriptionService))
      .compile();

    service = await module.resolve<EmailService>(EmailService);
    service.onModuleInit();
    eventEmitter = module.get<SubscriptionEventEmitter>('__event_emitter__');
  });

  afterEach(() => {
    reset(mockedSubscriptionService);
  });

  it('should send email', async () => {
    const to = 'example@email.com';
    const title = 'title';
    const message = 'message';

    expect(() => service.sendEmail(to, title, message)).not.toThrow();
  });

  it('should listen newOutdatedDependencies event', () => {
    const subscription = {
      _id: '507f1f77bcf86cd799439011',
      repositoryUrl: 'https://github.com/oguzcan-yavuz/nestjs-task-management',
      emails: ['oguzcanyavuz321@gmail.com', 'random@example.com'],
    };
    const reportOutdatedDependenciesSpy = jest.spyOn(
      service,
      'reportOutdatedDependencies',
    );
    const outdatedDependenciesOfSubscription: OutdatedDependenciesOfSubscription = {
      subscriptionId: '507f1f77bcf86cd799439011',
      outdatedDependencies: [
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
      ],
    };
    when(
      mockedSubscriptionService.getSubscription(subscription._id),
    ).thenResolve(subscription);

    eventEmitter.emit(
      'newOutdatedDependencies',
      outdatedDependenciesOfSubscription,
    );

    expect(reportOutdatedDependenciesSpy).toHaveBeenCalledWith(
      outdatedDependenciesOfSubscription,
    );
  });

  it('should send emails for outdated dependencies', async () => {
    const subscription = {
      _id: '507f1f77bcf86cd799439011',
      repositoryUrl: 'https://github.com/oguzcan-yavuz/nestjs-task-management',
      emails: ['oguzcanyavuz321@gmail.com', 'random@example.com'],
    };
    const sendEmailSpy = jest.spyOn(service, 'sendEmail');
    const reportOutdatedDependenciesSpy = jest.spyOn(
      service,
      'reportOutdatedDependencies',
    );
    const outdatedDependenciesOfSubscription: OutdatedDependenciesOfSubscription = {
      subscriptionId: '507f1f77bcf86cd799439011',
      outdatedDependencies: [
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
      ],
    };
    when(
      mockedSubscriptionService.getSubscription(subscription._id),
    ).thenResolve(subscription);

    await service.reportOutdatedDependencies(
      outdatedDependenciesOfSubscription,
    );

    expect(reportOutdatedDependenciesSpy).toHaveBeenCalledWith(
      outdatedDependenciesOfSubscription,
    );
    expect(sendEmailSpy).toHaveBeenCalledWith(
      subscription.emails[0],
      'New outdated dependency!',
      `You can update ${outdatedDependenciesOfSubscription.outdatedDependencies[0].name} from ${outdatedDependenciesOfSubscription.outdatedDependencies[0].version} to ${outdatedDependenciesOfSubscription.outdatedDependencies[0].latestVersion}`,
    );
    expect(sendEmailSpy).toHaveBeenCalledWith(
      subscription.emails[1],
      'New outdated dependency!',
      `You can update ${outdatedDependenciesOfSubscription.outdatedDependencies[0].name} from ${outdatedDependenciesOfSubscription.outdatedDependencies[0].version} to ${outdatedDependenciesOfSubscription.outdatedDependencies[0].latestVersion}`,
    );
    expect(sendEmailSpy).toHaveBeenCalledWith(
      subscription.emails[0],
      'New outdated dependency!',
      `You can update ${outdatedDependenciesOfSubscription.outdatedDependencies[1].name} from ${outdatedDependenciesOfSubscription.outdatedDependencies[1].version} to ${outdatedDependenciesOfSubscription.outdatedDependencies[1].latestVersion}`,
    );
    expect(sendEmailSpy).toHaveBeenCalledWith(
      subscription.emails[1],
      'New outdated dependency!',
      `You can update ${outdatedDependenciesOfSubscription.outdatedDependencies[1].name} from ${outdatedDependenciesOfSubscription.outdatedDependencies[1].version} to ${outdatedDependenciesOfSubscription.outdatedDependencies[1].latestVersion}`,
    );
  });
});
