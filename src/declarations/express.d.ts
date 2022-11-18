import { UserToken } from '@/domain/authentication/types';

export {};

declare global {
  namespace Express {
    export interface Request {
      user?: UserToken;
    }
  }
}
