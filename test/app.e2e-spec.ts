import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { OutdatedDependency } from '../src/remote/remote.types';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterEach(() => {
    app.close();
  });

  it('/subscriptions (POST) - invalid repositoryUrl', () => {
    return request(app.getHttpServer())
      .post('/subscriptions')
      .set('Remote-Provider', 'github')
      .send({
        repositoryUrl: 'invalid-url',
        emails: ['oguzcanyavuz321@gmail.com', 'random@example.com'],
      })
      .expect(400);
  });

  it('/subscriptions (POST) - invalid emails', () => {
    return request(app.getHttpServer())
      .post('/subscriptions')
      .set('Remote-Provider', 'github')
      .send({
        repositoryUrl:
          'https://github.com/oguzcan-yavuz/nestjs-task-management',
        emails: ['oguzcanyavuz321@gmail.com', 'invalid-email'],
      })
      .expect(400);
  });

  it('/subscriptions (POST) - invalid remote repository provider', () => {
    return request(app.getHttpServer())
      .post('/subscriptions')
      .set('Remote-Provider', 'github')
      .send({
        repositoryUrl:
          'https://invalidgitrepo.com/oguzcan-yavuz/nestjs-task-management',
        emails: ['oguzcanyavuz321@gmail.com', 'invalid-email'],
      })
      .expect(400);
  });

  describe('npmOrYarn', () => {
    let subscriptionId: string;
    it('/subscriptions (POST) - success', () => {
      return request(app.getHttpServer())
        .post('/subscriptions')
        .set('Remote-Provider', 'github')
        .send({
          repositoryUrl:
            'https://github.com/oguzcan-yavuz/nestjs-task-management',
          emails: ['oguzcanyavuz321@gmail.com', 'random@example.com'],
        })
        .expect(201)
        .then(response => {
          expect(response.body).toHaveProperty('id');
          subscriptionId = response.body.id;
        });
    });

    it(`/subscriptions/:subscriptionId/outdated-dependencies (GET) - success`, () => {
      return request(app.getHttpServer())
        .get(`/subscriptions/${subscriptionId}/outdated-dependencies`)
        .set('Remote-Provider', 'github')
        .expect(200)
        .then(response => {
          expect(response.body).toBeInstanceOf(Array);

          const outdatedDependencies = response.body as OutdatedDependency[];

          console.log('outdatedDeps:', outdatedDependencies);

          outdatedDependencies.forEach(dependency => {
            expect(dependency).toEqual(
              expect.objectContaining({
                name: expect.any(String),
                version: expect.any(String),
                latestVersion: expect.any(String),
              }),
            );
          });
        });
    });
  });

  describe('composer', () => {
    let subscriptionId: string;
    it('/subscriptions (POST) - success', () => {
      return request(app.getHttpServer())
        .post('/subscriptions')
        .set('Remote-Provider', 'github')
        .send({
          repositoryUrl: 'https://github.com/symfony/symfony',
          emails: ['oguzcanyavuz321@gmail.com', 'random@example.com'],
        })
        .expect(201)
        .then(response => {
          expect(response.body).toHaveProperty('id');
          subscriptionId = response.body.id;
        });
    });

    it(`/subscriptions/:subscriptionId/outdated-dependencies (GET) - success`, () => {
      return request(app.getHttpServer())
        .get(`/subscriptions/${subscriptionId}/outdated-dependencies`)
        .set('Remote-Provider', 'github')
        .expect(200)
        .then(response => {
          expect(response.body).toBeInstanceOf(Array);

          const outdatedDependencies = response.body as OutdatedDependency[];

          console.log('outdatedDeps:', outdatedDependencies);

          outdatedDependencies.forEach(dependency => {
            expect(dependency).toEqual(
              expect.objectContaining({
                name: expect.any(String),
                version: expect.any(String),
                latestVersion: expect.any(String),
              }),
            );
          });
        });
    });
  });
});
