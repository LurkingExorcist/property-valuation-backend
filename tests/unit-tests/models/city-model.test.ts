import faker from '@faker-js/faker';

import City from '@/domain/cities/City.model';

describe('City.model', () => {
  it('::new', () => {
    const city = City.new({
      name: faker.address.city(),
      region: faker.address.state(),
    });

    expect(city).toBeInstanceOf(City);
  });

  it('::new without region', () => {
    const city = City.new({
      name: faker.address.city(),
    });

    expect(city).toBeInstanceOf(City);
  });
});
