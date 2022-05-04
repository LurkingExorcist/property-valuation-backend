import { attachControllers, middlewareHandler } from '@decorators/express';
import * as cors from 'cors';
import * as express from 'express';
import helmet from 'helmet';

import AccessRightController from '@/domain/access-rights/AccessRight.controller';
import ApartmentController from '@/domain/apartments/Apartment.controller';
import AuthenticationController from '@/domain/authentication/Authentication.controller';
import CityController from '@/domain/cities/City.controller';
import UserController from '@/domain/users/User.controller';
import ViewInWindowController from '@/domain/views-in-window/ViewInWindow.controller';

import { PORT } from '@/config';
import ServerErrorMiddleware from '@/middlewares/ServerErrorMiddleware';

export class App {
  private app: express.Express;

  constructor() {
    this.config();
  }

  static init() {
    return new App();
  }

  public listen() {
    this.app.listen(PORT, () =>
      console.log(`Application is listening on :${PORT}`)
    );
  }

  public getApp() {
    return this.app;
  }

  private config() {
    this.app = express();
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(helmet());

    attachControllers(this.app, [
      AccessRightController,
      ApartmentController,
      AuthenticationController,
      CityController,
      UserController,
      ViewInWindowController,
    ]);

    this.app.use(middlewareHandler(ServerErrorMiddleware));
  }
}
