import { attachControllers, middlewareHandler } from '@decorators/express';
import * as cors from 'cors';
import * as express from 'express';
import helmet from 'helmet';

import { PORT } from '@/constants';

import {
  ApartmentController,
  AuthenticationController,
  CityController,
  DatasetController,
  MathModelController,
  ModelTypeController,
  UserController,
  ViewInWindowController,
} from '@/domain';
import { NotFoundMiddleware, ServerErrorMiddleware } from '@/middlewares';

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
      MathModelController,
      ModelTypeController,
      DatasetController,
    ]);

    this.app.use(middlewareHandler(NotFoundMiddleware));
    this.app.use(middlewareHandler(ServerErrorMiddleware));
  }
}
