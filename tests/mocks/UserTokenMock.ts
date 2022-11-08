import * as jwt from 'jsonwebtoken';
import _ = require('lodash');

import { TOKEN_EXPIRES_IN } from '@/constants';

import {
  AccessLevel,
  AccessRightService,
  DomainEntityType,
  User,
  UserService,
} from '@/domain';

export class UserTokenMock {
  private domainEntity: DomainEntityType;
  private accessLevel: AccessLevel;

  private user: User;

  private accessRightService: AccessRightService = new AccessRightService();
  private userService: UserService = new UserService();

  constructor(options: {
    domainEntity: DomainEntityType;
    accessLevel: AccessLevel;
  }) {
    this.domainEntity = options.domainEntity;
    this.accessLevel = options.accessLevel;
  }

  public async init() {
    await this.createUser();
  }

  public async clear() {
    await this.userService.remove({ id: this.user.id });
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

  private async createUser() {
    this.user = await this.userService.create({
      username: 'test',
      email: 'test@test.org',
      phoneNumber: '+79995554433',
      password: this.getPassword(),
      accessRights: [
        await this.accessRightService.create({
          domainEntity: this.domainEntity,
          accessLevel: this.accessLevel,
        }),
      ],
    });
  }
}
