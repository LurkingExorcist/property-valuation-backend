import 'dotenv/config';
import 'module-alias/register';

import AppDataSource from './data-source';
import main from './main';

AppDataSource.initialize()
  .then(main)
  .catch((error) => console.error(error));
