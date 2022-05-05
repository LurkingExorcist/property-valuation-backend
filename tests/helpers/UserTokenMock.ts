import * as jwt from 'jsonwebtoken';
import _ = require('lodash');

import AccessRight from '@/domain/access-rights/AccessRight.model';
import AccessRightService from '@/domain/access-rights/AccessRight.service';
import AccessType from '@/domain/access-rights/types/AccessType';
import AppSection from '@/domain/access-rights/types/AppSection';
import User from '@/domain/users/User.model';
import UserService from '@/domain/users/User.service';

export default class UserTokenMock {
  private section: AppSection;
  private rights: AccessType[];

  private accessRights: AccessRight[];
  private user: User;

  private accessRightService: AccessRightService = new AccessRightService();
  private userService: UserService = new UserService();

  constructor(options: { section: AppSection; rights: AccessType[] }) {
    this.section = options.section;
    this.rights = options.rights;
  }

  public async init() {
    await this.createAccessRights();
    await this.createUser();
  }

  public async clear() {
    await this.userService.remove({ id: this.user.id });
    await Promise.all(
      this.accessRights.map(({ id }) =>
        this.accessRightService.remove({
          id,
        })
      )
    );
  }

  public getToken() {
    return jwt.sign(_.toPlainObject(this.user), process.env.JWT_SECRET);
  }

  private async createAccessRights() {
    this.accessRights = await Promise.all(
      this.rights.map((accessType) =>
        this.accessRightService.create({
          appSection: this.section,
          accessType,
        })
      )
    );
  }

  private async createUser() {
    this.user = await this.userService.create({
      username: 'test',
      email: 'test@test.org',
      phoneNumber: '+79995554433',
      password: 'test',
      accessRights: this.accessRights,
    });
  }
}
