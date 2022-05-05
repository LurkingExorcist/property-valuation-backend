import 'jest';
import * as express from 'express';
import { StatusCodes } from 'http-status-codes';
import _ = require('lodash');
import * as request from 'supertest';
import CityMock from 'tests/helpers/CityMock';
import UserTokenMock from 'tests/helpers/UserTokenMock';
import ViewInWindowMock from 'tests/helpers/ViewInWindowMock';

import { URLS } from '@/config';

import AppDataSource from '@/data-source';

import AccessType from '@/domain/access-rights/types/AccessType';
import AppSection from '@/domain/access-rights/types/AppSection';
import Apartment from '@/domain/apartments/Apartment.model';

import { App } from '@/lib/app';

describe(URLS.APARTMENTS, () => {
  const userMock = new UserTokenMock({
    section: AppSection.APARTMENTS,
    rights: [AccessType.READ, AccessType.WRITE],
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
    await cityMock.clear();
    await viewInWindowMock.clear();
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

        expect(
          data.find((instance) => instance.id === testEntity.id)
        ).toMatchObject(testEntity);

        done();
      });
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

  it('DELETE /:id', (done) => {
    request(app)
      .delete(`${URLS.APARTMENTS}/${testEntity.id}`)
      .set('Authorization', `Bearer ${testToken}`)
      .expect(StatusCodes.OK)
      .end(() => done());
  });
});
