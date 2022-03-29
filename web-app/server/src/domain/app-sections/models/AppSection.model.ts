import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class AppSection {
  @PrimaryGeneratedColumn('uuid')
    id: string;

  @Column()
    name: string;
}
