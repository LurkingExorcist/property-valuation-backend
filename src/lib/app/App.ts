import { attachControllers } from '@decorators/express';
import * as cors from 'cors';
import * as express from 'express';
import helmet from 'helmet';

import AccessRightController from '@/domain/access-rights/AccessRight.controller';

import { PORT } from '@/config';

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

  private config() {
    this.app = express();
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(helmet());

    attachControllers(this.app, [AccessRightController]);
  }
}
