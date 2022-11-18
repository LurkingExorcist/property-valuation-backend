import { Column, Entity, PrimaryColumn } from 'typeorm';
import { v4 } from 'uuid';

import { Apartment } from '@/domain/apartment';

import { Where } from '@/types';

@Entity()
export class Dataset {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column('jsonb')
  datasetQuery: Where<Apartment>;

  static new(options: {
    name: string;
    description: string;
    datasetQuery: Where<Apartment>;
  }) {
    const entity = new Dataset();

    entity.id = v4();
    entity.name = options.name;
    entity.description = options.description;
    entity.datasetQuery = options.datasetQuery;

    return entity;
  }
}
