import 'dotenv/config';
import 'module-alias/register';
import * as fs from 'fs';
import path = require('path');

import * as _ from 'lodash';

import { AppDataSource } from '@/data-source';
import { Importer } from '@/lib';

const SOURCE_NAME = 'Интех';
const FILE_PATH = './data-science/datasets/filtered_apartments.csv';

AppDataSource.initialize()
  .then(() =>
    Importer.importApartments({
      source: SOURCE_NAME,
      filePath: FILE_PATH,
    })
  )
  .catch((error) => console.error(error));
