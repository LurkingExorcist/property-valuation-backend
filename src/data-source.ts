import 'reflect-metadata';

import { DataSource } from 'typeorm';

import { AccessRight, Apartment, City, User, ViewInWindow } from './domain';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: process.env.PG_USERNAME,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  synchronize: true,
  entities: [AccessRight, Apartment, City, User, ViewInWindow],
  migrations: [],
  subscribers: [],
  // logging: ['query', 'error'],
});
