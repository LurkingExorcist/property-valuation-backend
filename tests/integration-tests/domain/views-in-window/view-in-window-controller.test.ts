import 'jest';
import faker from '@faker-js/faker';
import * as express from 'express';
import { StatusCodes } from 'http-status-codes';
import * as request from 'supertest';
import UserTokenMock from 'tests/mocks/UserTokenMock';

import { URLS } from '@/config';

import AppDataSource from '@/data-source';

import AccessType from '@/domain/access-rights/types/AccessType';
import AppSection from '@/domain/access-rights/types/AppSection';
import ViewInWindow from '@/domain/views-in-window/ViewInWindow.model';

import { App } from '@/lib/app';

console.error = jest.fn();

describe(URLS.VIEWS_IN_WINDOW, () => {
  const userRightlessMock = new UserTokenMock({
    section: AppSection.CITIES,
    rights: [],
  });
  const userMock = new UserTokenMock({
    section: AppSection.VIEWS_IN_WINDOW,
    rights: [AccessType.READ, AccessType.WRITE],
  });

  let testQuery: Record<string, any>;
  let testEntity: ViewInWindow;

  let app: express.Application;
  let testToken: string;

  beforeAll(async () => {
    await AppDataSource.initialize();
    await userMock.init();
    await userRightlessMock.init();

    testToken = userMock.getToken();
    app = App.init().getApp();

    testQuery = {
      name: faker.lorem.word(),
      description: faker.lorem.words(),
    };
  });

  afterAll(async () => {
    await userMock.clear();
    await userRightlessMock.clear();
  });

  it('/ should return unauthorized is not provided', async () => {
    await request(app)
      .get(URLS.VIEWS_IN_WINDOW)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(StatusCodes.UNAUTHORIZED);
  });

  it('/ should return unauthorized if token is wrong', async () => {
    await request(app)
      .get(URLS.VIEWS_IN_WINDOW)
      .set('Authorization', `Bearer 42`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(StatusCodes.UNAUTHORIZED);
  });

  it('/ should return unauthorized if token is expired', async () => {
    await request(app)
      .get(URLS.VIEWS_IN_WINDOW)
      .set('Authorization', `Bearer ${userMock.getToken(0)}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(StatusCodes.UNAUTHORIZED);
  });

  it('POST / should return forbidden if user have no write right', async () => {
    await request(app)
      .post(URLS.VIEWS_IN_WINDOW)
      .set('Authorization', `Bearer ${userRightlessMock.getToken()}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(StatusCodes.FORBIDDEN);
  });

  it('POST /', (done) => {
    request(app)
      .post(URLS.VIEWS_IN_WINDOW)
      .set('Authorization', `Bearer ${testToken}`)
      .set('Accept', 'application/json')
      .send(testQuery)
      .end((err, res) => {
        if (err) return done(err);

        testEntity = res.body;
        expect(res.body).toMatchObject(testQuery);
        done();
      });
  });

  it('GET / should return forbidden if user have no read right', async () => {
    await request(app)
      .get(URLS.VIEWS_IN_WINDOW)
      .set('Authorization', `Bearer ${userRightlessMock.getToken()}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(StatusCodes.FORBIDDEN);
  });

  it('GET /', (done) => {
    request(app)
      .get(URLS.VIEWS_IN_WINDOW)
      .set('Authorization', `Bearer ${testToken}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(StatusCodes.OK)
      .end((err, res) => {
        if (err) return done(err);
        const data: ViewInWindow[] = res.body;

        expect(data).toBeInstanceOf(Array);

        done();
      });
  });

  it('GET /:id should return forbidden if user have no read right', async () => {
    await request(app)
      .get(`${URLS.VIEWS_IN_WINDOW}/${testEntity.id}`)
      .set('Authorization', `Bearer ${userRightlessMock.getToken()}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(StatusCodes.FORBIDDEN);
  });

  it('GET /:id', (done) => {
    request(app)
      .get(`${URLS.VIEWS_IN_WINDOW}/${testEntity.id}`)
      .set('Authorization', `Bearer ${testToken}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(StatusCodes.OK)
      .end((err, res) => {
        if (err) return done(err);

        const data: ViewInWindow = res.body;
        expect(data).toMatchObject(testEntity);

        done();
      });
  });

  it('PUT /:id should return forbidden if user have no write right', async () => {
    await request(app)
      .put(`${URLS.VIEWS_IN_WINDOW}/${testEntity.id}`)
      .set('Authorization', `Bearer ${userRightlessMock.getToken()}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(StatusCodes.FORBIDDEN);
  });

  it('PUT /:id', (done) => {
    const updateData = {
      name: faker.lorem.word(),
      description: faker.lorem.words(),
    };

    request(app)
      .put(`${URLS.VIEWS_IN_WINDOW}/${testEntity.id}`)
      .set('Authorization', `Bearer ${testToken}`)
      .set('Accept', 'application/json')
      .send(updateData)
      .expect('Content-Type', /json/)
      .expect(StatusCodes.OK)
      .end((err, res) => {
        if (err) return done(err);

        const instance: ViewInWindow = res.body;
        expect(instance.name).toBe(updateData.name);
        expect(instance.description).toBe(updateData.description);

        done();
      });
  });

  it('DELETE /:id should return forbidden if user have no write right', async () => {
    await request(app)
      .delete(`${URLS.VIEWS_IN_WINDOW}/${testEntity.id}`)
      .set('Authorization', `Bearer ${userRightlessMock.getToken()}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(StatusCodes.FORBIDDEN);
  });

  it('DELETE /:id', (done) => {
    request(app)
      .delete(`${URLS.VIEWS_IN_WINDOW}/${testEntity.id}`)
      .set('Authorization', `Bearer ${testToken}`)
      .expect(StatusCodes.OK)
      .end(() => done());
  });
});
