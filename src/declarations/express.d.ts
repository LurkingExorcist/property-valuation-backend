import { UserToken } from '@/domain/authentication/types';

declare global {
  namespace Express {
    interface Request {
      user?: UserToken;
    }
  }
}
