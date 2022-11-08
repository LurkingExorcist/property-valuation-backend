import { attachControllers, middlewareHandler } from '@decorators/express';
import * as cors from 'cors';
import * as express from 'express';
import helmet from 'helmet';

import { PORT } from '@/constants';

import ApartmentController from '@/domain/apartments/Apartment.controller';
import AuthenticationController from '@/domain/authentication/Authentication.controller';
import CityController from '@/domain/city/controllers/City.controller';
import UserController from '@/domain/user/User.controller';
import ViewInWindowController from '@/domain/view-in-window/ViewInWindow.controller';

import NotFoundMiddleware from '@/middlewares/NotFoundMiddleware';
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
    return this.app.listen(PORT, () =>
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
      ApartmentController,
      AuthenticationController,
      CityController,
      UserController,
      ViewInWindowController,
    ]);

    this.app.use(middlewareHandler(NotFoundMiddleware));
    this.app.use(middlewareHandler(ServerErrorMiddleware));
  }
}
