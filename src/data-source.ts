import { DataSource } from 'typeorm';

import AccessRight from '@/domain/access-rights/AccessRight.model';
import Apartment from '@/domain/apartments/Apartment.model';
import AppSection from '@/domain/app-sections/AppSection.model';
import User from '@/domain/users/User.model';
import ViewInWindow from '@/domain/views-in-window/ViewInWindow.model';

import 'reflect-metadata';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: process.env.PG_USERNAME,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  synchronize: true,
  entities: [AccessRight, Apartment, AppSection, User, ViewInWindow],
  migrations: [],
  subscribers: [],
  // logging: ['query', 'error'],
});

export default AppDataSource;
