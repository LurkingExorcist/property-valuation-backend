import { faker } from '@faker-js/faker';

import { DOMAIN_ENTITY_TYPES } from '@/constants';

import { ServerError } from '@/lib';

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
      ServerError.cantCreate({ entity: DOMAIN_ENTITY_TYPES.ACCESS_RIGHT })
    ).toBeInstanceOf(ServerError);
  });

  it('::cantFind', () => {
    expect(
      ServerError.cantFind({ entity: DOMAIN_ENTITY_TYPES.APARTMENT })
    ).toBeInstanceOf(ServerError);
  });

  it('::cantUpdate', () => {
    expect(
      ServerError.cantUpdate({ entity: DOMAIN_ENTITY_TYPES.CITY })
    ).toBeInstanceOf(ServerError);
  });

  it('::cantRemove', () => {
    expect(
      ServerError.cantRemove({ entity: DOMAIN_ENTITY_TYPES.USER })
    ).toBeInstanceOf(ServerError);
  });
});
