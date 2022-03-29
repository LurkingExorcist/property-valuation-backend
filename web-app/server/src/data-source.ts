import { DataSource } from 'typeorm';

import 'reflect-metadata';

import Apartment from './domain/apartments/models/Apartment.model';
import ViewInWindow from './domain/views-in-window/models/ViewInWindow.model';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: process.env.PG_USERNAME,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  synchronize: true,
  logging: false,
  entities: [Apartment, ViewInWindow],
  migrations: [],
  subscribers: [],
});
