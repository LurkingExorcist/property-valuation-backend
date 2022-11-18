import 'dotenv/config';
import 'module-alias/register';
import * as _ from 'lodash';

import { AppDataSource } from '@/data-source';
import {
  Apartment,
  City,
  ViewInWindow,
  DATASET_VIEW_COLUMNS,
  DATASET_TABLE_COLUMNS,
  DatasetTableColumn,
  DatasetViewColumn,
} from '@/domain';
import { CsvIO } from '@/lib';
import { ElementType } from '@/types';

const FILE_PATH = './data-science/datasets/filtered_apartments.csv';

type ApartmentRecord = Record<DatasetTableColumn, string>;

const recordToEntities = (row: ApartmentRecord) => {
  const viewNames = _(row)
    .entries()
    .filter(
      ([key, value]) =>
        DATASET_VIEW_COLUMNS.includes(key as DatasetViewColumn) &&
        Boolean(+value)
    )
    .map(([key]) => key)
    .value();

  const apartment = Apartment.new({
    city: City.new({ name: row.city }),
    floor: Number(row.floor),
    totalArea: Number(row.total_area),
    livingArea: Number(row.living_area),
    kitchenArea: Number(row.kitchen_area),
    roomCount: Number(row.room_count),
    height: Number(row.height),
    isStudio: Boolean(+row.is_studio),
    totalPrice: Math.floor(Number(row.total_price)),
    viewsInWindow: viewNames.map((name) => ViewInWindow.new({ name })),
  });

  return apartment;
};

const importApartments = async () => {
  console.info('IMPORT APARTMENTS');
  console.info('script started');
  console.log();

  try {
    const table = CsvIO.read({
      filePath: FILE_PATH,
      columns: DATASET_TABLE_COLUMNS,
      excludeHeader: true,
    });

    const foundViews = await AppDataSource.manager.find(ViewInWindow);
    const foundCities = await AppDataSource.manager.find(City);

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const savedViewsNames: ViewInWindow[] = [...foundViews];
      const savedCities: City[] = [...foundCities];

      const entities = table.map(recordToEntities);

      let index = 0;
      for (const apartment of entities) {
        apartment.viewsInWindow = apartment.viewsInWindow.map(
          (entity) =>
            savedViewsNames.find((view) => view.name === entity.name) || entity
        );

        const notSavedViews = apartment.viewsInWindow.filter(
          (entity) => !savedViewsNames.find((view) => view.name === entity.name)
        );

        await queryRunner.manager.save(notSavedViews);
        savedViewsNames.push(...notSavedViews);

        const savedCity = savedCities.find(
          (city) => city.name === apartment.city.name
        );
        apartment.city = savedCity || apartment.city;

        if (!savedCity) {
          savedCities.push(apartment.city);
          await queryRunner.manager.save(apartment.city);
        }

        await queryRunner.manager.save(apartment);
        console.info(`${index + 1} of ${entities.length} is saved`);

        index++;
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      console.error(err);

      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  } catch (err) {
    console.error(err);
  } finally {
    console.log();
    console.info('script ended');
  }
};

AppDataSource.initialize()
  .then(importApartments)
  .catch((error) => console.error(error));
