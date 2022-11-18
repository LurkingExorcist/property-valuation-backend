import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 } from 'uuid';

import { City } from '@/domain/city';
import { ViewInWindow } from '@/domain/view-in-window';

import { IModel } from '@/interfaces';
import { ElementType } from '@/types';

import { DATASET_VIEW_COLUMNS } from '../constants';
import { DatasetViewColumn } from '../types';

@Entity()
export class Apartment implements IModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => City)
  city: City;

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
    city: City;
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

    entity.id = v4();
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

  toDatasetObject(options: { index: number }) {
    return {
      index: options.index,
      city: this.city.name,
      floor: this.floor,
      total_area: this.totalArea,
      living_area: this.livingArea,
      kitchen_area: this.kitchenArea,
      room_count: this.roomCount,
      height: this.height,
      is_studio: this.isStudio ? 1 : 0,
      ...DATASET_VIEW_COLUMNS.reduce(
        (acc, col) => ({
          ...acc,
          [col]: this.viewsInWindow.find((view) => view.name === col) ? 1 : 0,
        }),
        {} as Record<DatasetViewColumn, boolean>
      ),
      total_price: this.totalPrice,
    };
  }
}
