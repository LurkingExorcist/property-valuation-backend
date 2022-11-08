import 'dotenv/config';
import 'module-alias/register';

import { AppDataSource } from './data-source';
import { App } from './lib/app';

AppDataSource.initialize()
  .then(() => App.init().listen())
  .catch((error) => console.error(error));
