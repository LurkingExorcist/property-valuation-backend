import { JwtPayload } from 'jsonwebtoken';

import { User } from '@/domain/user';

export type UserToken = User & JwtPayload;
