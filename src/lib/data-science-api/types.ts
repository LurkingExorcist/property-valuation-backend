import { Apartment } from '@/domain';

export type TrainParams = {
  name: string;
  datasetName: string;
  modelType: string;
  formula: string;
};

export type PredictParams = {
  name: string;
  datasetName: string;
};

export type TrainDataFrameSummary = {
  'r.squared': [number];
  'adj.r.squared': [number];
  sigma: [number];
  statistic: [number];
  'p.value': [number];
  df: [number];
  logLik: [number];
  AIC: [number];
  BIC: [number];
  deviance: [number];
  'df.residual': [number];
  nobs: [number];
};

export type TrainSummary = {
  [Key in keyof TrainDataFrameSummary]: TrainDataFrameSummary[Key][0];
};

export type TrainResult = {
  summary: TrainDataFrameSummary;
  output: string[];
};

export type PredictResult = Record<
  keyof Omit<{ index: number } & Apartment, 'id'>,
  number[]
>;
