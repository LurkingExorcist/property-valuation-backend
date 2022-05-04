import { Injectable } from '@decorators/di';
import * as jwt from 'jsonwebtoken';

import ServerError from '@/lib/server-error/ServerError';
import _ = require('lodash');

import UserService from '../users/User.service';

@Injectable()
export default class AuthenticationService {
  constructor(private userService: UserService) {}

  async signin(query: { username: string; password: string }) {
    const [user] = await this.userService.find({ username: query.username });

    if (_.isNil(user) || !user.checkPassword(query.password)) {
      throw ServerError.cantAuthenticate();
    }

    if (_.isNil(process.env.JWT_SECRET)) {
      throw ServerError.internalError({
        message: 'Невозможно создать jwt-токен',
      });
    }

    return jwt.sign(user, process.env.JWT_SECRET);
  }
}
