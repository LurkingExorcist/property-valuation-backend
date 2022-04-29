import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import IModel from '@/interfaces/IModel';

@Entity()
export default class AppSection implements IModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ default: '-' })
  description: string;

  static new(options: { name: string; description?: string }) {
    const entity = new AppSection();
    entity.name = options.name;
    entity.description = options.description;

    return entity;
  }
}
