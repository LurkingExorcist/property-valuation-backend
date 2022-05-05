import { Injectable } from '@decorators/di';
import _ = require('lodash');
import { v4 } from 'uuid';

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
    this.views = await Promise.all(
      _.range(5).map(() =>
        this.viewService.create({
          name: v4(),
        })
      )
    );
  }

  public async clear() {
    await Promise.all(
      this.views.map((view) => this.viewService.remove({ id: view.id }))
    );
  }
}
