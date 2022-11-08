import 'jest';
import * as express from 'express';
import { StatusCodes } from 'http-status-codes';
import _ = require('lodash');
import * as request from 'supertest';
import { UserTokenMock } from 'tests/mocks';
import { v4 } from 'uuid';

import { DOMAIN_ENTITY_TYPES, URLS } from '@/constants';

import { AppDataSource } from '@/data-source';
import { App, ServerError } from '@/lib';

console.error = jest.fn();

describe(URLS.AUTHENTICATION, () => {
  const userMock = new UserTokenMock({
    domainEntity: DOMAIN_ENTITY_TYPES.USER,
    accessLevel: 2,
  });

  let testQuery: Record<string, any>;

  let app: express.Application;

  beforeAll(async () => {
    await AppDataSource.initialize();
    await userMock.init();

    app = App.init().getApp();

    testQuery = {
      username: userMock.getUser().username,
      password: userMock.getPassword(),
    };
  });

  afterAll(async () => {
    await userMock.clear();
  });

  it('POST /signin', (done) => {
    request(app)
      .post(`${URLS.AUTHENTICATION}/signin`)
      .set('Accept', 'application/json')
      .send(testQuery)
      .expect('Content-Type', /json/)
      .expect(StatusCodes.OK)
      .end((err, res) => {
        try {
          if (err) return done(err);

          expect(_.isString(res.body.token)).toBe(true);
          done();
        } catch (err) {
          done(err);
        }
      });
  });

  it('POST /signin with auth error', (done) => {
    request(app)
      .post(`${URLS.AUTHENTICATION}/signin`)
      .set('Accept', 'application/json')
      .send({ ...testQuery, password: v4() })
      .expect('Content-Type', /json/)
      .expect(StatusCodes.UNAUTHORIZED)
      .end((err, res) => {
        try {
          if (err) return done(err);

          expect(res.body).toMatchObject(
            _.omitBy(ServerError.cantAuthenticate(), _.isNil)
          );
          done();
        } catch (err) {
          done(err);
        }
      });
  });
});
