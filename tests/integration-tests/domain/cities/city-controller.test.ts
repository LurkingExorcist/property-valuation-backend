import 'jest';
import { faker } from '@faker-js/faker';
import * as express from 'express';
import { StatusCodes } from 'http-status-codes';
import * as request from 'supertest';
import { UserTokenMock } from 'tests/mocks';

import { DOMAIN_ENTITY_TYPES, URLS } from '@/constants';

import { App } from '@/lib/app';

import { AppDataSource } from '@/data-source';
import { City } from '@/domain';

console.error = jest.fn();

describe(URLS.CITIES, () => {
  const userRightlessMock = new UserTokenMock({
    domainEntity: DOMAIN_ENTITY_TYPES.CITY,
    accessLevel: 0,
  });
  const userMock = new UserTokenMock({
    domainEntity: DOMAIN_ENTITY_TYPES.CITY,
    accessLevel: 2,
  });

  let testQuery: Record<string, any>;
  let testEntity: City;

  let app: express.Application;
  let testToken: string;

  beforeAll(async () => {
    await AppDataSource.initialize();
    await userRightlessMock.init();
    await userMock.init();

    testToken = userMock.getToken();
    app = App.init().getApp();

    testQuery = {
      name: faker.address.city(),
      region: faker.address.state(),
    };
  });

  afterAll(async () => {
    await userMock.clear();
    await userRightlessMock.clear();
  });

  it('/ should return unauthorized is not provided', async () => {
    await request(app)
      .get(URLS.CITIES)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(StatusCodes.UNAUTHORIZED);
  });

  it('/ should return unauthorized if token is wrong', async () => {
    await request(app)
      .get(URLS.CITIES)
      .set('Authorization', `Bearer 42`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(StatusCodes.UNAUTHORIZED);
  });

  it('/ should return unauthorized if token is expired', async () => {
    await request(app)
      .get(URLS.CITIES)
      .set('Authorization', `Bearer ${userMock.getToken(0)}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(StatusCodes.UNAUTHORIZED);
  });

  it('POST / should return forbidden if user have no write right', async () => {
    await request(app)
      .post(URLS.CITIES)
      .set('Authorization', `Bearer ${userRightlessMock.getToken()}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(StatusCodes.FORBIDDEN);
  });

  it('POST /', (done) => {
    request(app)
      .post(URLS.CITIES)
      .set('Authorization', `Bearer ${testToken}`)
      .set('Accept', 'application/json')
      .send(testQuery)
      .expect('Content-Type', /json/)
      .expect(StatusCodes.OK)
      .end((err, res) => {
        if (err) return done(err);

        testEntity = res.body;
        expect(res.body).toMatchObject(testQuery);
        done();
      });
  });

  it('GET / should return forbidden if user have no read right', async () => {
    await request(app)
      .get(URLS.CITIES)
      .set('Authorization', `Bearer ${userRightlessMock.getToken()}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(StatusCodes.FORBIDDEN);
  });

  it('GET /', (done) => {
    request(app)
      .get(URLS.CITIES)
      .set('Authorization', `Bearer ${testToken}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(StatusCodes.OK)
      .end((err, res) => {
        if (err) return done(err);
        const data: City[] = res.body;

        expect(data).toBeInstanceOf(Array);

        done();
      });
  });

  it('GET /:id should return forbidden if user have no read right', async () => {
    await request(app)
      .get(`${URLS.CITIES}/${testEntity.id}`)
      .set('Authorization', `Bearer ${userRightlessMock.getToken()}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(StatusCodes.FORBIDDEN);
  });

  it('GET /:id', (done) => {
    request(app)
      .get(`${URLS.CITIES}/${testEntity.id}`)
      .set('Authorization', `Bearer ${testToken}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(StatusCodes.OK)
      .end((err, res) => {
        if (err) return done(err);

        const data: City = res.body;
        expect(data).toMatchObject(testEntity);

        done();
      });
  });

  it('PUT /:id should return forbidden if user have no read right', async () => {
    await request(app)
      .put(`${URLS.CITIES}/${testEntity.id}`)
      .set('Authorization', `Bearer ${userRightlessMock.getToken()}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(StatusCodes.FORBIDDEN);
  });

  it('PUT /:id', (done) => {
    const updateData = {
      name: faker.address.city(),
      region: faker.address.state(),
    };

    request(app)
      .put(`${URLS.CITIES}/${testEntity.id}`)
      .set('Authorization', `Bearer ${testToken}`)
      .set('Accept', 'application/json')
      .send(updateData)
      .expect('Content-Type', /json/)
      .expect(StatusCodes.OK)
      .end((err, res) => {
        if (err) return done(err);

        const instance: City = res.body;
        expect(instance.name).toBe(updateData.name);
        expect(instance.region).toBe(updateData.region);

        done();
      });
  });

  it('DELETE /:id should return forbidden if user have no read right', async () => {
    await request(app)
      .delete(`${URLS.CITIES}/${testEntity.id}`)
      .set('Authorization', `Bearer ${userRightlessMock.getToken()}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(StatusCodes.FORBIDDEN);
  });

  it('DELETE /:id', (done) => {
    request(app)
      .delete(`${URLS.CITIES}/${testEntity.id}`)
      .set('Authorization', `Bearer ${testToken}`)
      .expect(StatusCodes.OK)
      .end(() => done());
  });
});
