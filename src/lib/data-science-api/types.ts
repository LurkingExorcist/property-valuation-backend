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

export type PredictResult = {
  index: number[];
  city: number[];
  floor: number[];
  total_area: number[];
  living_area: number[];
  kitchen_area: number[];
  room_count: number[];
  height: number[];
  is_studio: number[];
  view_building: number[];
  view_city: number[];
  view_cottages: number[];
  view_field: number[];
  view_forest: number[];
  view_north: number[];
  view_parking: number[];
  view_playground: number[];
  view_school: number[];
  view_street: number[];
  view_water: number[];
  view_west: number[];
  view_yard: number[];
  total_price: number[];
  total_price_pred: number[];
  difference_val: number[];
  difference_percent: number[];
};
