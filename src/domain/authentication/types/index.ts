import { JwtPayload } from 'jsonwebtoken';

import User from '@/domain/users/User.model';

export type UserToken = User & JwtPayload;
