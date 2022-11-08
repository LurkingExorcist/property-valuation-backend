import { faker } from '@faker-js/faker';

import { ViewInWindow } from '@/domain';

describe('ViewInWindow.model', () => {
  it('::new', () => {
    const viewinwindow = ViewInWindow.new({
      name: faker.lorem.word(),
      description: faker.lorem.words(),
    });

    expect(viewinwindow).toBeInstanceOf(ViewInWindow);
  });

  it('::new without description', () => {
    const viewinwindow = ViewInWindow.new({
      name: faker.lorem.word(),
    });

    expect(viewinwindow).toBeInstanceOf(ViewInWindow);
  });
});
