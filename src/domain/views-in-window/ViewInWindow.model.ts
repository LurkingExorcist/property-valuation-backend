import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import IModel from '@/interfaces/IModel';

@Entity()
export default class ViewInWindow implements IModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ default: '-' })
  description: string;

  static new(name: string) {
    const entity = new ViewInWindow();
    entity.name = name;

    return entity;
  }
}
