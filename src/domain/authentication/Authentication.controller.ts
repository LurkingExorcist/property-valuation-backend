import { Injectable } from '@decorators/di';
import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Response,
} from '@decorators/express';
import * as express from 'express';

import { URLS } from '@/config';

import UserService from '@/domain/users/User.service';

import ServerError from '@/lib/server-error/ServerError';

import AuthMiddleware from '@/middlewares/AuthMiddleware';

import { EntityType } from '@/types';

import AuthenticationService from './Authentication.service';

@Controller(URLS.AUTHENTICATION)
@Injectable()
export default class AuthenticationController {
  constructor(
    private service: AuthenticationService,
    private userService: UserService
  ) {}

  @Post('/signin')
  async signin(
    @Response() res: express.Response,
    @Body()
    data: {
      username: string;
      password: string;
    }
  ): Promise<void> {
    await this.service.signin(data).then((token) =>
      res.json({
        token,
      })
    );
  }

  @Get('/me', [AuthMiddleware])
  async me(
    @Request() req: express.Request,
    @Response() res: express.Response
  ): Promise<void> {
    if (!req.user) {
      throw ServerError.cantFind({ entity: EntityType.USER });
    }

    await this.userService
      .findById(
        {
          id: req.user?.id,
        },
        {
          accessRights: true,
        }
      )
      .then((user) => res.json(user));
  }
}
