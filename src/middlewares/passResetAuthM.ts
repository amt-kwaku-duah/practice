import { NextFunction, Request as ExpressRequest, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../secrets';
import { prismaUse } from '../server';
import { UnauthorizedException } from '../exceptions/unAuthorised';
import { ErrorCode } from '../exceptions/rootException';

export interface User {
  staffId: string;
  role: string;
}

interface Request extends ExpressRequest {
  user?: User;
}

export const passAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
  
      if (!token) {
        return res.status(401).json({ error: 'Authentication token not provided' });
      }
  
      try {
        const payload: any = jwt.verify(token, JWT_SECRET);
        const { userId, role } = payload;
        const user = await prismaUse.user.findFirst({ where: { id: userId } });
        if (!user) {
          throw new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED);
        }

        req.user = { ...user, role };
        next();
      } catch (error) {
        next(new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED));
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };
