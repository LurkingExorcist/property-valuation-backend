import _ = require('lodash');
import { v4 } from 'uuid';

import { Apartment, City, ViewInWindow } from '@/domain';

describe('Apartment.model', () => {
  it('::new', () => {
    const apartment = Apartment.new({
      city: City.new({
        name: 'Test',
        region: 'Test',
      }),
      viewsInWindow: _.range(5).map(() =>
        ViewInWindow.new({
          name: v4(),
        })
      ),
      floor: _.random(42),
      totalArea: _.random(42),
      livingArea: _.random(42),
      kitchenArea: _.random(42),
      roomCount: _.random(42),
      height: _.random(42),
      isStudio: Boolean(_.random()),
      totalPrice: _.random(1_000_000, 100_000_000),
    });

    expect(apartment).toBeInstanceOf(Apartment);
  });
});
