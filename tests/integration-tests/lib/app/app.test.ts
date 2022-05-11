import { Server } from 'http';

import { App } from '@/lib/app';

describe('App', () => {
  let app: App;

  it('::init', () => {
    app = App.init();

    expect(app).toBeInstanceOf(App);
  });

  it('.getApp', () => {
    expect(app.getApp()).toBeDefined();
  });

  it('.listen', () => {
    const server = app.listen();
    expect(server).toBeInstanceOf(Server);

    server.close();
  });
});
