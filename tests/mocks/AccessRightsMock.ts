import { Injectable } from '@decorators/di';
import { faker } from '@faker-js/faker';
import _ = require('lodash');

import { DOMAIN_ENTITY_TYPES } from '@/constants';

import { AccessRight, AccessRightService, ACCESS_LEVELS } from '@/domain';

@Injectable()
export class AccessRightsMock {
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
          domainEntity: faker.helpers.objectValue(DOMAIN_ENTITY_TYPES),
          accessLevel: faker.helpers.objectValue(ACCESS_LEVELS),
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
