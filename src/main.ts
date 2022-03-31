// import generateAccessRights from './scripts/generate-access-rights';
import { In } from 'typeorm';

import AccessType from './domain/access-rights/types/AccessType';
import Apartment from './domain/apartments/Apartment.model';
import User from './domain/users/User.model';
import listenApp from './app';
import AppDataSource from './data-source';

const main = async () => {
  // listenApp();
  await AppDataSource.manager
    .find(Apartment, {
      relations: {
        viewsInWindow: true
      },
      where: {
        viewsInWindow: {
          name: 'view_school'
        }
      }
    })
    .then((data) => console.dir(data, { depth: 10 }));
};

export default main;
