import { Response } from 'express';

export interface ICrudController {
  findById(res: Response, id: string): Promise<void>;
  find(res: Response, query: Record<string, unknown>): Promise<void>;
  create(res: Response, data: Record<string, unknown>): Promise<void>;
  update(
    res: Response,
    id: string,
    data: Record<string, unknown>
  ): Promise<void>;
  remove(res: Response, id: string): Promise<void>;
}
