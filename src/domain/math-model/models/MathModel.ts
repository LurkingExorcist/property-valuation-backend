import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { v4 } from 'uuid';

import { Dataset } from '@/domain/dataset';
import { ModelType } from '@/domain/model-type';

import { TrainSummary } from '@/lib';

@Entity()
export class MathModel {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => ModelType)
  modelType: ModelType;

  @Column()
  formula: string;

  @ManyToOne(() => Dataset, { nullable: true })
  trainDataset: Dataset | null;

  @Column('jsonb', { nullable: true })
  trainSummary: TrainSummary | null;

  @Column('timestamp', { nullable: true })
  trainedDate: Date | null;

  static new(options: {
    name: string;
    datasetPath: string;
    modelType: ModelType;
    formula: string;
  }) {
    const entity = new MathModel();

    entity.id = v4();
    entity.name = options.name;
    entity.trainDataset = null;
    entity.modelType = options.modelType;
    entity.formula = options.formula;
    entity.trainSummary = null;
    entity.trainedDate = null;

    return entity;
  }
}
