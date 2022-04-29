import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import IModel from '@/interfaces/IModel';

import AppSection from '../app-sections/AppSection.model';

import AccessType from './types/AccessType';

@Entity()
export default class AccessRight implements IModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => AppSection)
  appSection: AppSection;

  @Column({
    type: 'enum',
    enum: AccessType,
  })
  accessType: AccessType;

  static new(options: { appSection: AppSection; accessType: AccessType }) {
    const entity = new AccessRight();
    entity.appSection = options.appSection;
    entity.accessType = options.accessType;

    return entity;
  }
}
