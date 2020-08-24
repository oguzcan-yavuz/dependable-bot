import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

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
      .send({
        repositoryUrl: 'invalid-url',
        emails: ['oguzcanyavuz321@gmail.com', 'random@example.com'],
      })
      .expect(400);
  });

  it('/subscriptions (POST) - invalid emails', () => {
    return request(app.getHttpServer())
      .post('/subscriptions')
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
      .send({
        repositoryUrl:
          'https://invalidgitrepo.com/oguzcan-yavuz/nestjs-task-management',
        emails: ['oguzcanyavuz321@gmail.com', 'invalid-email'],
      })
      .expect(400);
  });

  it('/subscriptions (POST) - success', () => {
    return request(app.getHttpServer())
      .post('/subscriptions')
      .send({
        repositoryUrl:
          'https://github.com/oguzcan-yavuz/nestjs-task-management',
        emails: ['oguzcanyavuz321@gmail.com', 'random@example.com'],
      })
      .expect(201);
  });
});
