import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import ViewInWindow from '@/domain/views-in-window/ViewInWindow.model';

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

  static new(options: {
    city: string;
    floor: number;
    totalArea: number;
    livingArea: number;
    kitchenArea: number;
    roomCount: number;
    height: number;
    isStudio: boolean;
    totalPrice: number;
    viewsInWindow: ViewInWindow[];
  }) {
    const entity = new Apartment();

    entity.city = options.city;
    entity.floor = options.floor;
    entity.totalArea = options.totalArea;
    entity.livingArea = options.livingArea;
    entity.kitchenArea = options.kitchenArea;
    entity.roomCount = options.roomCount;
    entity.height = options.height;
    entity.isStudio = options.isStudio;
    entity.totalPrice = options.totalPrice;
    entity.viewsInWindow = options.viewsInWindow;

    return entity;
  }
}
