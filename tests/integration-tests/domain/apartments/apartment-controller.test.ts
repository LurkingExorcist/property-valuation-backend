import 'jest';
import * as express from 'express';
import { StatusCodes } from 'http-status-codes';
import _ = require('lodash');
import * as request from 'supertest';
import { CityMock, UserTokenMock, ViewInWindowMock } from 'tests/mocks';

import { DOMAIN_ENTITY_TYPES, URLS } from '@/constants';

import { App } from '@/lib/app';

import { AppDataSource } from '@/data-source';
import { ACCESS_LEVELS, Apartment } from '@/domain';

console.error = jest.fn();

describe(URLS.APARTMENTS, () => {
  const userRightlessMock = new UserTokenMock({
    domainEntity: DOMAIN_ENTITY_TYPES.APARTMENT,
    accessLevel: 0,
  });
  const userMock = new UserTokenMock({
    domainEntity: DOMAIN_ENTITY_TYPES.APARTMENT,
    accessLevel: 2,
  });
  const cityMock = new CityMock();
  const viewInWindowMock = new ViewInWindowMock();

  let testQuery: Record<string, any>;
  let testEntity: Apartment;

  let app: express.Application;
  let testToken: string;

  beforeAll(async () => {
    await AppDataSource.initialize();
    await userMock.init();
    await userRightlessMock.init();
    await cityMock.init();
    await viewInWindowMock.init();

    testToken = userMock.getToken();
    app = App.init().getApp();

    testQuery = {
      cityId: cityMock.getCity().id,
      viewsInWindowIds: viewInWindowMock
        .getViewsInWindow()
        .map((view) => view.id),
      floor: _.random(42),
      totalArea: _.random(42),
      livingArea: _.random(42),
      kitchenArea: _.random(42),
      roomCount: _.random(42),
      height: _.random(42),
      isStudio: Boolean(_.random()),
      totalPrice: _.random(1_000_000, 100_000_000),
    };
  });

  afterAll(async () => {
    await userMock.clear();
    await userRightlessMock.clear();
    await cityMock.clear();
    await viewInWindowMock.clear();
  });

  it('/ should return unauthorized is not provided', async () => {
    await request(app)
      .get(URLS.APARTMENTS)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(StatusCodes.UNAUTHORIZED);
  });

  it('/ should return unauthorized if token is wrong', async () => {
    await request(app)
      .get(URLS.APARTMENTS)
      .set('Authorization', `Bearer 42`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(StatusCodes.UNAUTHORIZED);
  });

  it('/ should return unauthorized if token is expired', async () => {
    await request(app)
      .get(URLS.APARTMENTS)
      .set('Authorization', `Bearer ${userMock.getToken(0)}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(StatusCodes.UNAUTHORIZED);
  });

  it('POST / should return forbidden if user have no write right', async () => {
    await request(app)
      .post(URLS.APARTMENTS)
      .set('Authorization', `Bearer ${userRightlessMock.getToken()}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(StatusCodes.FORBIDDEN);
  });

  it('POST /', (done) => {
    request(app)
      .post(URLS.APARTMENTS)
      .set('Authorization', `Bearer ${testToken}`)
      .set('Accept', 'application/json')
      .send(testQuery)
      .expect('Content-Type', /json/)
      .expect(StatusCodes.OK)
      .end((err, res) => {
        if (err) return done(err);

        testEntity = res.body;
        expect(res.body).toMatchObject(
          _.omit(testQuery, 'cityId', 'viewsInWindowIds')
        );
        done();
      });
  });

  it('GET / should return forbidden if user have no read right', async () => {
    await request(app)
      .get(URLS.APARTMENTS)
      .set('Authorization', `Bearer ${userRightlessMock.getToken()}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(StatusCodes.FORBIDDEN);
  });

  it('GET /', (done) => {
    request(app)
      .get(URLS.APARTMENTS)
      .set('Authorization', `Bearer ${testToken}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(StatusCodes.OK)
      .end((err, res) => {
        if (err) return done(err);
        const data: Apartment[] = res.body;

        expect(data).toBeInstanceOf(Array);

        done();
      });
  });

  it('GET /:id should return forbidden if user have no read right', async () => {
    await request(app)
      .get(`${URLS.APARTMENTS}/${testEntity.id}`)
      .set('Authorization', `Bearer ${userRightlessMock.getToken()}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(StatusCodes.FORBIDDEN);
  });

  it('GET /:id', (done) => {
    request(app)
      .get(`${URLS.APARTMENTS}/${testEntity.id}`)
      .set('Authorization', `Bearer ${testToken}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(StatusCodes.OK)
      .end((err, res) => {
        if (err) return done(err);

        const data: Apartment = res.body;
        expect(data).toMatchObject(testEntity);

        done();
      });
  });

  it('PUT /:id should return forbidden if user have no write right', async () => {
    const updateData = {
      floor: _.random(42),
    };

    await request(app)
      .put(`${URLS.APARTMENTS}/${testEntity.id}`)
      .set('Authorization', `Bearer ${userRightlessMock.getToken()}`)
      .send(updateData)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(StatusCodes.FORBIDDEN);
  });

  it('PUT /:id', (done) => {
    const updateData = {
      floor: _.random(42),
      totalArea: _.random(42),
      livingArea: _.random(42),
      kitchenArea: _.random(42),
      roomCount: _.random(42),
      height: _.random(42),
      isStudio: Boolean(_.random()),
      totalPrice: _.random(1_000_000, 100_000_000),
    };

    request(app)
      .put(`${URLS.APARTMENTS}/${testEntity.id}`)
      .set('Authorization', `Bearer ${testToken}`)
      .set('Accept', 'application/json')
      .send(updateData)
      .expect('Content-Type', /json/)
      .expect(StatusCodes.OK)
      .end((err, res) => {
        if (err) return done(err);

        const instance: Apartment = res.body;
        expect(instance.floor).toBe(updateData.floor);
        expect(instance.totalArea).toBe(updateData.totalArea);
        expect(instance.livingArea).toBe(updateData.livingArea);
        expect(instance.kitchenArea).toBe(updateData.kitchenArea);
        expect(instance.roomCount).toBe(updateData.roomCount);
        expect(instance.height).toBe(updateData.height);
        expect(instance.isStudio).toBe(updateData.isStudio);
        expect(instance.totalPrice).toBe(updateData.totalPrice);

        done();
      });
  });

  it('PUT /:id with cityId', (done) => {
    cityMock
      .loadCity()
      .then((city) => {
        const updateData = {
          cityId: city.id,
        };

        return new Promise<void>((resolve, reject) => {
          request(app)
            .put(`${URLS.APARTMENTS}/${testEntity.id}`)
            .set('Authorization', `Bearer ${testToken}`)
            .set('Accept', 'application/json')
            .send(updateData)
            .expect('Content-Type', /json/)
            .expect(StatusCodes.OK)
            .end((err, res) => {
              try {
                if (err) return done(err);

                const instance: Apartment = res.body;
                expect(instance.city).toMatchObject(city);

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

  it('PUT /:id with viewsInWindowIds', (done) => {
    viewInWindowMock
      .loadViewsInWindow()
      .then((viewsInWindow) => {
        const updateData = {
          viewsInWindowIds: viewsInWindow.map((view) => view.id),
        };

        return new Promise<void>((resolve, reject) => {
          request(app)
            .put(`${URLS.APARTMENTS}/${testEntity.id}`)
            .set('Authorization', `Bearer ${testToken}`)
            .set('Accept', 'application/json')
            .send(updateData)
            .expect('Content-Type', /json/)
            .expect(StatusCodes.OK)
            .end((err, res) => {
              try {
                if (err) return done(err);

                const instance: Apartment = res.body;

                instance.viewsInWindow.forEach((view) => {
                  expect(view).toMatchObject(
                    viewsInWindow.find(
                      (foundView) => foundView.id === view.id
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

  it('DELETE /:id should return forbidden if user have no write right', async () => {
    await request(app)
      .delete(`${URLS.APARTMENTS}/${testEntity.id}`)
      .set('Authorization', `Bearer ${userRightlessMock.getToken()}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(StatusCodes.FORBIDDEN);
  });

  it('DELETE /:id', (done) => {
    request(app)
      .delete(`${URLS.APARTMENTS}/${testEntity.id}`)
      .set('Authorization', `Bearer ${testToken}`)
      .expect(StatusCodes.OK)
      .end(() => done());
  });
});
