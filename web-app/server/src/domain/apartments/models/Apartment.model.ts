import {
  Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn,
} from 'typeorm';

import ViewInWindow from '@/domain/views-in-window/models/ViewInWindow.model';

@Entity()
export default class Apartment {
  @PrimaryGeneratedColumn('uuid')
    id: string;

  @Column()
    city: string;

  @Column('int')
    floor: number;

  @Column('float')
    totalArea: number;

  @Column('float')
    livingArea: number;

  @Column('float')
    kitchenArea: number;

  @Column('int')
    roomCount: number;

  @Column('float')
    height: number;

  @Column('boolean')
    isStudio: boolean;

  @Column('int')
    totalPrice: number;

  @ManyToMany(() => ViewInWindow)
  @JoinTable()
    viewsInWindow: ViewInWindow[];
}
