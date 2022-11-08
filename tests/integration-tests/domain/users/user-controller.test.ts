import 'jest';
import { faker } from '@faker-js/faker';
import * as express from 'express';
import { StatusCodes } from 'http-status-codes';
import _ = require('lodash');
import * as request from 'supertest';
import { AccessRightsMock, UserTokenMock } from 'tests/mocks';

import { DOMAIN_ENTITY_TYPES, URLS } from '@/constants';

import { AppDataSource } from '@/data-source';
import { User } from '@/domain';
import { App } from '@/lib';

console.error = jest.fn();

describe(URLS.USERS, () => {
  const userRightlessMock = new UserTokenMock({
    domainEntity: DOMAIN_ENTITY_TYPES.USER,
    accessLevel: 0,
  });
  const userMock = new UserTokenMock({
    domainEntity: DOMAIN_ENTITY_TYPES.USER,
    accessLevel: 2,
  });
  const accessRightsMock = new AccessRightsMock();

  let testQuery: Record<string, any>;
  let testEntity: User;

  let app: express.Application;
  let testToken: string;

  beforeAll(async () => {
    await AppDataSource.initialize();
    await userMock.init();
    await userRightlessMock.init();
    await accessRightsMock.init();

    testToken = userMock.getToken();
    app = App.init().getApp();

    testQuery = {
      username: faker.internet.userName(),
      email: faker.internet.email(),
      phoneNumber: faker.phone.number('+7 (900) ###-##-##'),
      password: faker.internet.password(),
      accessRightsIds: accessRightsMock
        .getAccessRights()
        .map((view) => view.id),
    };
  });

  afterAll(async () => {
    await userMock.clear();
    await userRightlessMock.clear();
    await accessRightsMock.clear();
  });

  it('/ should return unauthorized is not provided', async () => {
    await request(app)
      .get(URLS.USERS)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(StatusCodes.UNAUTHORIZED);
  });

  it('/ should return unauthorized if token is wrong', async () => {
    await request(app)
      .get(URLS.USERS)
      .set('Authorization', `Bearer 42`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(StatusCodes.UNAUTHORIZED);
  });

  it('/ should return unauthorized if token is expired', async () => {
    await request(app)
      .get(URLS.USERS)
      .set('Authorization', `Bearer ${userMock.getToken(0)}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(StatusCodes.UNAUTHORIZED);
  });

  it('POST / should return forbidden if user have no write right', async () => {
    await request(app)
      .post(URLS.USERS)
      .set('Authorization', `Bearer ${userRightlessMock.getToken()}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(StatusCodes.FORBIDDEN);
  });

  it('POST /', (done) => {
    request(app)
      .post(URLS.USERS)
      .set('Authorization', `Bearer ${testToken}`)
      .set('Accept', 'application/json')
      .send(testQuery)
      .expect('Content-Type', /json/)
      .expect(StatusCodes.OK)
      .end((err, res) => {
        if (err) return done(err);

        testEntity = res.body;
        expect(res.body).toMatchObject(
          _.omit(testQuery, 'accessRightsIds', 'password')
        );
        done();
      });
  });

  it('POST / without accessRightsIds', (done) => {
    request(app)
      .post(URLS.USERS)
      .set('Authorization', `Bearer ${testToken}`)
      .set('Accept', 'application/json')
      .send(_.omit(testQuery, 'accessRightsIds'))
      .expect('Content-Type', /json/)
      .expect(StatusCodes.OK)
      .end((err, res) => {
        if (err) return done(err);

        testEntity = res.body;
        expect(res.body).toMatchObject(
          _.omit(testQuery, 'accessRightsIds', 'password')
        );
        done();
      });
  });

  it('GET / should return forbidden if user have no read right', async () => {
    await request(app)
      .get(URLS.USERS)
      .set('Authorization', `Bearer ${userRightlessMock.getToken()}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(StatusCodes.FORBIDDEN);
  });

  it('GET /', (done) => {
    request(app)
      .get(URLS.USERS)
      .set('Authorization', `Bearer ${testToken}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(StatusCodes.OK)
      .end((err, res) => {
        if (err) return done(err);
        const data: User[] = res.body;

        expect(data).toBeInstanceOf(Array);

        done();
      });
  });

  it('GET /:id should return forbidden if user have no read right', async () => {
    await request(app)
      .get(`${URLS.USERS}/${testEntity.id}`)
      .set('Authorization', `Bearer ${userRightlessMock.getToken()}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(StatusCodes.FORBIDDEN);
  });

  it('GET /:id', (done) => {
    request(app)
      .get(`${URLS.USERS}/${testEntity.id}`)
      .set('Authorization', `Bearer ${testToken}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(StatusCodes.OK)
      .end((err, res) => {
        if (err) return done(err);

        const data: User = res.body;
        expect(data).toMatchObject(testEntity);

        done();
      });
  });

  it('PUT /:id should return forbidden if user have no read right', async () => {
    await request(app)
      .put(`${URLS.USERS}/${testEntity.id}`)
      .set('Authorization', `Bearer ${userRightlessMock.getToken()}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(StatusCodes.FORBIDDEN);
  });

  it('PUT /:id', (done) => {
    const updateData = {
      username: faker.internet.userName(),
      email: faker.internet.email(),
      phoneNumber: faker.phone.phoneNumber('+7 (900) ###-##-##'),
    };

    request(app)
      .put(`${URLS.USERS}/${testEntity.id}`)
      .set('Authorization', `Bearer ${testToken}`)
      .set('Accept', 'application/json')
      .send(updateData)
      .expect('Content-Type', /json/)
      .expect(StatusCodes.OK)
      .end((err, res) => {
        if (err) return done(err);

        const instance: User = res.body;
        expect(instance.username).toBe(updateData.username);
        expect(instance.email).toBe(updateData.email);
        expect(instance.phoneNumber).toBe(updateData.phoneNumber);

        done();
      });
  });

  it('PUT /:id with accessRightsIds', (done) => {
    accessRightsMock
      .loadAccessRights()
      .then((accessRights) => {
        const updateData = {
          accessRightsIds: accessRights.map((accessRight) => accessRight.id),
        };

        return new Promise<void>((resolve, reject) => {
          request(app)
            .put(`${URLS.USERS}/${testEntity.id}`)
            .set('Authorization', `Bearer ${testToken}`)
            .set('Accept', 'application/json')
            .send(updateData)
            .expect('Content-Type', /json/)
            .expect(StatusCodes.OK)
            .end((err, res) => {
              try {
                if (err) return done(err);

                const instance: User = res.body;
                instance.accessRights.forEach((accessRight) => {
                  expect(accessRight).toMatchObject(
                    accessRights.find(
                      (foundAccessRight) =>
                        foundAccessRight.id === accessRight.id
                    ) || {}
                  );
                });

                resolve();
              } catch (err) {
                reject(err);
              }
            });
        });
      })
      .then(done)
      .catch(done);
  });

  it('DELETE /:id should return forbidden if user have no read right', async () => {
    await request(app)
      .delete(`${URLS.USERS}/${testEntity.id}`)
      .set('Authorization', `Bearer ${userRightlessMock.getToken()}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(StatusCodes.FORBIDDEN);
  });

  it('DELETE /:id', (done) => {
    request(app)
      .delete(`${URLS.USERS}/${testEntity.id}`)
      .set('Authorization', `Bearer ${testToken}`)
      .expect(StatusCodes.OK)
      .end(() => done());
  });
});
