import 'dotenv/config';
import 'module-alias/register';
import * as _ from 'lodash';

import AppDataSource from '@/data-source';

import Apartment from '@/domain/apartments/Apartment.model';
import City from '@/domain/cities/City.model';
import ViewInWindow from '@/domain/views-in-window/ViewInWindow.model';

import CsvReader from '@/lib/csv-reader/CsvReader';

import { ElementType } from '@/types';

const FILE_PATH = './data-science/out/tables/filtered_apartments.csv';
const VIEW_COLUMNS = [
  'view_building',
  'view_city',
  'view_cottages',
  'view_field',
  'view_forest',
  'view_north',
  'view_parking',
  'view_playground',
  'view_school',
  'view_street',
  'view_water',
  'view_west',
  'view_yard',
] as const;
const TABLE_COLUMNS = [
  'index',
  'city',
  'floor',
  'total_area',
  'living_area',
  'kitchen_area',
  'room_count',
  'height',
  'is_studio',
  ...VIEW_COLUMNS,
  'total_price',
] as const;

type ApartmentRecord = Record<ElementType<typeof TABLE_COLUMNS>, string>;

const recordToEntities = (row: ApartmentRecord) => {
  const viewNames = _(row)
    .entries()
    .filter(
      ([key, value]) =>
        VIEW_COLUMNS.includes(
          key as unknown as ElementType<typeof VIEW_COLUMNS>
        ) && Boolean(+value)
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
    const table = CsvReader.read({
      filePath: FILE_PATH,
      columns: TABLE_COLUMNS,
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
