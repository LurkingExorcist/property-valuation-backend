import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class ViewInWindow {
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
