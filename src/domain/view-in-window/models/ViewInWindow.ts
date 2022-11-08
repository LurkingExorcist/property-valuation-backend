import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { v4 } from 'uuid';

import { IModel } from '@/interfaces';

@Entity()
export class ViewInWindow implements IModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  static new(options: { name: string; description?: string }) {
    const entity = new ViewInWindow();

    entity.id = v4();
    entity.name = options.name;
    entity.description = options.description || '-';

    return entity;
  }
}
