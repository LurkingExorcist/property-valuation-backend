import faker from '@faker-js/faker';

import ServerError from '@/lib/server-error/ServerError';

import { EntityType } from '@/types';

describe('ServerError', () => {
  it('::notFound', () => {
    expect(
      ServerError.notFound({ method: 'POST', route: '/test' })
    ).toBeInstanceOf(ServerError);
  });

  it('::badRequest', () => {
    expect(
      ServerError.badRequest({ message: faker.lorem.sentence() })
    ).toBeInstanceOf(ServerError);
  });

  it('::internalError', () => {
    expect(
      ServerError.internalError({ message: faker.lorem.sentence() })
    ).toBeInstanceOf(ServerError);
  });

  it('::forbidden', () => {
    expect(ServerError.forbidden()).toBeInstanceOf(ServerError);
  });

  it('::unauthorized', () => {
    expect(ServerError.unauthorized()).toBeInstanceOf(ServerError);
  });

  it('::tokenExpired', () => {
    expect(ServerError.tokenExpired()).toBeInstanceOf(ServerError);
  });

  it('::cantAuthenticate', () => {
    expect(ServerError.cantAuthenticate()).toBeInstanceOf(ServerError);
  });

  it('::cantCreate', () => {
    expect(
      ServerError.cantCreate({ entity: EntityType.ACCESS_RIGHT })
    ).toBeInstanceOf(ServerError);
  });

  it('::cantFind', () => {
    expect(
      ServerError.cantFind({ entity: EntityType.APARTMENT })
    ).toBeInstanceOf(ServerError);
  });

  it('::cantUpdate', () => {
    expect(ServerError.cantUpdate({ entity: EntityType.CITY })).toBeInstanceOf(
      ServerError
    );
  });

  it('::cantRemove', () => {
    expect(ServerError.cantRemove({ entity: EntityType.USER })).toBeInstanceOf(
      ServerError
    );
  });
});
