import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { v4 } from 'uuid';

import IModel from '@/interfaces/IModel';

import AccessType from './types/AccessType';
import AppSection from './types/AppSection';

@Entity()
export default class AccessRight implements IModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: AppSection,
  })
  appSection: AppSection;

  @Column({
    type: 'enum',
    enum: AccessType,
  })
  accessType: AccessType;

  static new(options: { appSection: AppSection; accessType: AccessType }) {
    const entity = new AccessRight();

    entity.id = v4();
    entity.appSection = options.appSection;
    entity.accessType = options.accessType;

    return entity;
  }
}
