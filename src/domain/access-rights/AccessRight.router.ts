import { Router } from 'express';

import AppDataSource from '@/data-source';

import AccessRight from './AccessRight.model';

const accessRightsRouter = Router();

accessRightsRouter.get('/', (req, res) =>
  AppDataSource.manager.find(AccessRight).then(res.json)
);

export default accessRightsRouter;
