import * as express from 'express';
import { StatusCodes } from 'http-status-codes';
import _ = require('lodash');
import { QueryFailedError } from 'typeorm';

import ServerError from '@/lib/server-error/ServerError';

import ServerErrorMiddleware from '@/middlewares/ServerErrorMiddleware';

class MockRequest {}
class MockResponse {
  statusCode: number;
  body: object;

  status(statusCode: number) {
    this.statusCode = statusCode;
    return this;
  }
  json(body: object) {
    this.body = body;
    return this;
  }
}

const nextMock = jest.fn();
console.error = jest.fn();

describe('ServerErrorMiddleware', () => {
  const middleware = new ServerErrorMiddleware();

  it('.use with ServerError', () => {
    const error = ServerError.forbidden();
    const req = new MockRequest() as express.Request;
    const res = new MockResponse() as unknown as express.Response;

    middleware.use(error, req, res, nextMock);

    expect(res.statusCode).toBe(error.status);
    expect((res as unknown as MockResponse).body).toMatchObject(error);
  });

  it('.use with QueryFailedError', () => {
    const error = new QueryFailedError('test', [], new Error('test'));
    const req = new MockRequest() as express.Request;
    const res = new MockResponse() as unknown as express.Response;

    middleware.use(error, req, res, nextMock);

    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect((res as unknown as MockResponse).body).toMatchObject(
      ServerError.badRequest({
        message: error.message,
        exception: error,
      })
    );
  });

  it('.use with Error', () => {
    const error = new Error('test');
    const req = new MockRequest() as express.Request;
    const res = new MockResponse() as unknown as express.Response;

    middleware.use(error, req, res, nextMock);

    expect(res.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    expect((res as unknown as MockResponse).body).toMatchObject(
      ServerError.internalError({
        message: error.message,
        exception: error,
      })
    );
  });

  it('.use with Object', () => {
    const error = {
      message: 42,
    };
    const req = new MockRequest() as express.Request;
    const res = new MockResponse() as unknown as express.Response;

    middleware.use(error, req, res, nextMock);

    expect(res.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    expect((res as unknown as MockResponse).body).toMatchObject(
      ServerError.internalError({
        message: 'Неизвестная ошибка',
        exception: new Error(_.toString(error.message)),
      })
    );
  });

  it('.use with string', () => {
    const error = 'test';
    const req = new MockRequest() as express.Request;
    const res = new MockResponse() as unknown as express.Response;

    middleware.use(error, req, res, nextMock);

    expect(res.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    expect((res as unknown as MockResponse).body).toMatchObject(
      ServerError.internalError({
        message: 'Неизвестная ошибка',
        exception: new Error(error),
      })
    );
  });
});
