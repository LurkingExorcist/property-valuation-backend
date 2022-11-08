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

import { DOMAIN_ENTITY_TYPES, URLS } from '@/constants';

import { UserService } from '@/domain/user';

import { ServerError } from '@/lib';
import { AuthMiddleware } from '@/middlewares';

import { AuthenticationService } from '../services';

@Controller(URLS.AUTHENTICATION)
@Injectable()
export class AuthenticationController {
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
      throw ServerError.cantFind({ entity: DOMAIN_ENTITY_TYPES.USER });
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
