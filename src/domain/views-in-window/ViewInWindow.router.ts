import { Router } from 'express';

import AppDataSource from '@/data-source';

import ViewInWindow from './ViewInWindow.model';

const viewInWindowRouter = Router();

viewInWindowRouter.get('/', (req, res) =>
  AppDataSource.manager.find(ViewInWindow).then(res.json)
);

export default viewInWindowRouter;
