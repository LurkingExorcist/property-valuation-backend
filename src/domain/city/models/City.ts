import { Column, Entity, PrimaryColumn } from 'typeorm';
import { v4 } from 'uuid';

@Entity()
export class City {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  region: string;

  static new(options: { name: string; region?: string }) {
    const entity = new City();

    entity.id = v4();
    entity.name = options.name;
    entity.region = options.region || '-';

    return entity;
  }
}
