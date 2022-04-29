import { compareSync, hashSync } from 'bcrypt';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import IModel from '@/interfaces/IModel';

import AccessRight from '../access-rights/AccessRight.model';

const SALT_ROUNDS = 10;

@Entity()
export default class User implements IModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  phoneNumber: string;

  @Column()
  passwordHash: string;

  @ManyToMany(() => AccessRight)
  @JoinTable()
  accessRights: AccessRight[];

  static new(options: {
    username: string;
    email: string;
    phoneNumber: string;
    password: string;
    accessRights: AccessRight[];
  }) {
    const entity = new User();

    entity.username = options.username;
    entity.email = options.email;
    entity.phoneNumber = options.phoneNumber;
    entity.accessRights = options.accessRights;
    entity.passwordHash = hashSync(options.password, SALT_ROUNDS);

    return entity;
  }

  checkPassword(password: string) {
    return compareSync(password, this.passwordHash);
  }
}
