import { AppDataSource } from '@/data-source';
import { Apartment, City, DATASET_TABLE_COLUMNS, ViewInWindow } from '@/domain';

import { CsvIO } from '../csv-io';

export class Importer {
  static async importApartments({
    source,
    filePath,
  }: {
    source: string;
    filePath: string;
  }) {
    console.info('IMPORT APARTMENTS');
    console.info('script started');
    console.log();

    try {
      const table = CsvIO.read({
        filePath,
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

        const entities = table.map((record) =>
          Apartment.fromDatasetObject({ source, record })
        );

        let index = 0;
        for (const apartment of entities) {
          apartment.viewsInWindow = apartment.viewsInWindow.map(
            (entity) =>
              savedViewsNames.find((view) => view.name === entity.name) ||
              entity
          );

          const notSavedViews = apartment.viewsInWindow.filter(
            (entity) =>
              !savedViewsNames.find((view) => view.name === entity.name)
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
  }
}
