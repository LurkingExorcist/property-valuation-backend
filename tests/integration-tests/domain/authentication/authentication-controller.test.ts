import 'jest';
import * as express from 'express';
import { StatusCodes } from 'http-status-codes';
import _ = require('lodash');
import * as request from 'supertest';
import UserTokenMock from 'tests/mocks/UserTokenMock';
import { v4 } from 'uuid';

import { URLS } from '@/config';

import AppDataSource from '@/data-source';

import AccessType from '@/domain/access-rights/types/AccessType';
import AppSection from '@/domain/access-rights/types/AppSection';

import { App } from '@/lib/app';
import ServerError from '@/lib/server-error/ServerError';

console.error = jest.fn();

describe(URLS.AUTHENTICATION, () => {
  const userMock = new UserTokenMock({
    section: AppSection.CITIES,
    rights: [AccessType.READ, AccessType.WRITE],
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
