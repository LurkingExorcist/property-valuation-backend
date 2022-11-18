import { Column, Entity, PrimaryColumn } from 'typeorm';
import { v4 } from 'uuid';

@Entity()
export class ModelType {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name: string;

  static new(options: { name: string }) {
    const entity = new ModelType();

    entity.id = v4();
    entity.name = options.name;

    return entity;
  }
}
