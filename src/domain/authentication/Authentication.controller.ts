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

import AuthMiddleware from '@/middlewares/AuthMiddleware';

import AuthenticationService from './Authentication.service';

@Controller(URLS.AUTHENTICATION)
@Injectable()
export default class AuthenticationController {
  constructor(private service: AuthenticationService) {}

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
    res.json(req.user);
  }
}
