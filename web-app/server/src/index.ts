import 'dotenv/config';

import listenApp from './app';
import { AppDataSource } from './data-source';

AppDataSource.initialize().then(listenApp).catch((error) => console.error(error));
