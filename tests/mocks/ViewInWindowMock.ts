import { Injectable } from '@decorators/di';
import faker from '@faker-js/faker';
import _ = require('lodash');

import ViewInWindow from '@/domain/views-in-window/ViewInWindow.model';
import ViewInWindowService from '@/domain/views-in-window/ViewInWindow.service';

@Injectable()
export default class ViewInWindowMock {
  private views: ViewInWindow[];
  private viewService: ViewInWindowService = new ViewInWindowService();

  public getViewsInWindow() {
    return this.views;
  }

  public async init() {
    this.views = await this.loadViewsInWindow();
  }

  public loadViewsInWindow() {
    return Promise.all(
      _.range(5).map(() =>
        this.viewService.create({
          name: faker.lorem.word(),
        })
      )
    );
  }

  public async clear() {
    await this.removeViewsInWindow(this.views);
  }

  private async removeViewsInWindow(views: ViewInWindow[]) {
    await Promise.all(
      views.map((view) => this.viewService.remove({ id: view.id }))
    );
  }
}
