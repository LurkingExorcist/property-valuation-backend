import * as jwt from 'jsonwebtoken';
import _ = require('lodash');

import { TOKEN_EXPIRES_IN } from '@/config';

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

  public getToken(expiresIn: number = TOKEN_EXPIRES_IN) {
    return jwt.sign(
      _.toPlainObject(_.omit(this.user, 'passwordHash')),
      process.env.JWT_SECRET,
      {
        expiresIn,
      }
    );
  }

  public getUser() {
    return this.user;
  }

  public getPassword() {
    return 'password';
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
      password: this.getPassword(),
      accessRights: this.accessRights,
    });
  }
}
