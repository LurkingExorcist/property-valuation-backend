import { Injectable } from '@decorators/di';
import faker from '@faker-js/faker';
import _ = require('lodash');

import AccessRight from '@/domain/access-rights/AccessRight.model';
import AccessRightService from '@/domain/access-rights/AccessRight.service';
import AccessType from '@/domain/access-rights/types/AccessType';
import AppSection from '@/domain/access-rights/types/AppSection';

@Injectable()
export default class AccessRightsMock {
  private accessRights: AccessRight[];
  private accessRightService: AccessRightService = new AccessRightService();

  public getAccessRights() {
    return this.accessRights;
  }

  public async init() {
    this.accessRights = await this.loadAccessRights();
  }

  public loadAccessRights() {
    return Promise.all(
      _.range(5).map(() =>
        this.accessRightService.create({
          appSection: faker.random.objectElement(AppSection),
          accessType: faker.random.objectElement(AccessType),
        })
      )
    );
  }

  public async clear() {
    await this.removeAccessRight(this.accessRights);
  }

  private async removeAccessRight(accessRights: AccessRight[]) {
    await Promise.all(
      accessRights.map((accessRight) =>
        this.accessRightService.remove({ id: accessRight.id })
      )
    );
  }
}
