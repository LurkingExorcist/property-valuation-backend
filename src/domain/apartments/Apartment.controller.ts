import { Router } from 'express';

import AppDataSource from '@/data-source';

import Apartment from './Apartment.model';

const apartmentsRouter = Router();

apartmentsRouter.get('/', (req, res) =>
  AppDataSource.manager.find(Apartment).then(res.json)
);

export default apartmentsRouter;
