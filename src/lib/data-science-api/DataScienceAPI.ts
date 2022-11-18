import axiosModule = require('axios');
import _ = require('lodash');

import { RSERVER_PORT } from '@/constants';

import {
  PredictParams,
  PredictResult,
  TrainParams,
  TrainResult,
} from './types';

import { DataConverter } from '../data-converter';

const axios = axiosModule as unknown as axiosModule.AxiosStatic;

const requester = axios.create({
  baseURL: `http://localhost:${RSERVER_PORT}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export class DataScienceAPI {
  static async train(params: TrainParams) {
    const { data } = await requester.post<TrainResult>('/train', params);

    return {
      output: data.output.join('\n'),
      summary: DataConverter.dataFrameToArray(data.summary)[0],
    };
  }

  static async predict(params: PredictParams) {
    const { data } = await requester.post<PredictResult>('/predict', params);

    return DataConverter.dataFrameToArray(data);
  }
}
