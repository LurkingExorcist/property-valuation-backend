import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { v4 } from 'uuid';

import { DOMAIN_ENTITY_TYPES } from '@/constants';

import { IModel } from '@/interfaces';

import { AccessLevel, DomainEntityType } from '../types';

@Entity()
export class AccessRight implements IModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: DOMAIN_ENTITY_TYPES,
  })
  domainEntity: DomainEntityType;

  @Column()
  accessLevel: AccessLevel;

  static new(options: {
    domainEntity: DomainEntityType;
    accessLevel: AccessLevel;
  }) {
    const entity = new AccessRight();

    entity.id = v4();
    entity.domainEntity = options.domainEntity;
    entity.accessLevel = options.accessLevel;

    return entity;
  }
}
