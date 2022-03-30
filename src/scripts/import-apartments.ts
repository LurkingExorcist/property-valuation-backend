import * as _ from 'lodash';

import CsvReader from '@/lib/csv-reader/CsvReader';

import Apartment from '@/domain/apartments/Apartment.model';
import ViewInWindow from '@/domain/views-in-window/ViewInWindow.model';

import AppDataSource from '@/data-source';
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
      ([key, value]) => VIEW_COLUMNS.includes(key as any) && Boolean(+value)
    )
    .map(([key, value]) => key)
    .value();

  const viewsInWindow = viewNames.map(ViewInWindow.new);
  const apartment = Apartment.new({
    city: row.city,
    floor: Number(row.floor),
    totalArea: Number(row.total_area),
    livingArea: Number(row.living_area),
    kitchenArea: Number(row.kitchen_area),
    roomCount: Number(row.room_count),
    height: Number(row.height),
    isStudio: Boolean(+row.is_studio),
    totalPrice: Math.floor(Number(row.total_price)),
    viewsInWindow,
  });

  return {
    apartment,
    viewsInWindow,
  };
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

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      await Promise.all(
        table
          .map(recordToEntities)
          .map(async ({ apartment, viewsInWindow }, index, { length }) => {
            viewsInWindow = await Promise.all(
              viewsInWindow.map(async (entity) => {
                const result = await queryRunner.manager.findOne(ViewInWindow, {
                  where: {
                    name: entity.name,
                  },
                });

                if (_.isNull(result)) {
                  await queryRunner.manager.insert(ViewInWindow, viewsInWindow);
                }

                return result || entity;
              })
            );

            apartment.viewsInWindow = viewsInWindow;

            await queryRunner.manager.insert(Apartment, apartment);
            console.info(`${index+1} of ${length} is inserted`);
          })
      );

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

export default importApartments;
