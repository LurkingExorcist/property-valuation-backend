import * as express from 'express';
import { StatusCodes } from 'http-status-codes';
import _ = require('lodash');
import * as request from 'supertest';
import { v4 } from 'uuid';

import { App } from '@/lib/app';

import { ServerError } from '@/lib';

console.error = jest.fn();

describe('NotFoundMiddleware', () => {
  const app: express.Application = App.init().getApp();

  it('shoud return 404 on random route', async () => {
    const route = `/${v4()}`;

    await request(app)
      .get(route)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(StatusCodes.NOT_FOUND)
      .expect(
        _.omitBy(ServerError.notFound({ method: 'GET', route }), _.isNil)
      );
  });
});
