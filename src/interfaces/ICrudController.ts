import * as express from 'express';

export default interface ICrudController {
  findById(res: express.Response, id: string): Promise<void>;
  find(res: express.Response, query: Record<string, unknown>): Promise<void>;
  create(res: express.Response, data: Record<string, unknown>): Promise<void>;
  update(
    res: express.Response,
    id: string,
    data: Record<string, unknown>
  ): Promise<void>;
  remove(res: express.Response, id: string): Promise<void>;
}
