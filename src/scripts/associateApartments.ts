import CsvReader from '@/lib/csv-reader/CsvReader';

import Apartment from '@/domain/apartments/Apartment.model';
import ViewInWindow from '@/domain/views-in-window/ViewInWindow.model';

import AppDataSource from '@/data-source';
import { ElementType } from '@/types';
import _ = require('lodash');

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

const runAssociation = async (row: ApartmentRecord) => {
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

  const viewsInWindow = await Promise.all(
    viewNames.map((name) =>
      AppDataSource.manager.findOneBy(ViewInWindow, { name })
    )
  );
  const apartment = await AppDataSource.manager.findOne(Apartment, {
    relations: {
      viewsInWindow: true,
    },
    where: {
      city: row.city,
      floor: Number(row.floor),
      totalArea: Number(row.total_area),
      livingArea: Number(row.living_area),
      kitchenArea: Number(row.kitchen_area),
      roomCount: Number(row.room_count),
      height: Number(row.height),
      isStudio: Boolean(+row.is_studio),
      totalPrice: Math.floor(Number(row.total_price)),
    },
  });

  apartment.viewsInWindow = _.unionBy(
    apartment.viewsInWindow,
    viewsInWindow,
    (view) => view.name
  );

  await AppDataSource.manager.save(apartment);
};

const associateApartments = async () => {
  await Promise.all(
    CsvReader.read({
      filePath: FILE_PATH,
      columns: TABLE_COLUMNS,
      excludeHeader: true,
    }).map(runAssociation)
  );
};

export default associateApartments;
