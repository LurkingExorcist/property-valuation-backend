import { Router } from 'express';

import AppDataSource from '@/data-source';

import AppSection from './AppSection.model';

const viewInWindowRouter = Router();

viewInWindowRouter.get('/', (req, res) =>
  AppDataSource.manager.find(AppSection).then(res.json)
);

export default viewInWindowRouter;
