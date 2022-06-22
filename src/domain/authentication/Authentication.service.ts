import { Injectable } from '@decorators/di';
import * as jwt from 'jsonwebtoken';
import _ = require('lodash');

import { TOKEN_EXPIRES_IN } from '@/config';

import UserService from '@/domain/users/User.service';

import ServerError from '@/lib/server-error/ServerError';

@Injectable()
export default class AuthenticationService {
  constructor(private userService: UserService) {}

  async signin(query: { username: string; password: string }) {
    const {
      content: [user],
    } = await this.userService.find({
      where: { username: query.username },
    });

    if (_.isNil(user) || !user.checkPassword(query.password)) {
      throw ServerError.cantAuthenticate();
    }

    return jwt.sign(
      _.toPlainObject(_.omit(user, 'passwordHash')),
      process.env.JWT_SECRET,
      {
        expiresIn: TOKEN_EXPIRES_IN,
      }
    );
  }
}
