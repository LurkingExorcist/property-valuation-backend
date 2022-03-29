import { Router } from 'express';

import { AppDataSource } from '@/data-source';

import User from '../models/User.model';

const usersRouter = Router();

usersRouter.get('/', (req, res) => AppDataSource.manager.find(User).then(res.json));

export default usersRouter;
