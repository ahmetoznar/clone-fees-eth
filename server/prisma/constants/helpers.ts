import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

interface IDecodedProps {
  wallet: string;
}

export const JWT_CONTROL = async (req: Request, res: Response, next: NextFunction) => {
  const authToken: string = String(req.headers.authorization);
  if (authToken) {
    try {
      const decoded = jwt.verify(authToken, process.env.SECRET_KEY || '');
      const myDecoded = decoded as IDecodedProps;
      
      if (myDecoded.wallet) {
        res.locals.wallet = myDecoded.wallet;
        return next()
      } else {
        throw new Error('Unauthorized');
      }
    } catch (err) {
      return res.status(401).json({
        error: 'Unauthorized',
        err
      });
    }
  } else {
    return res.status(401).json({
      error: 'Unauthorized'
    });
  }
};
export const JWT_ADMIN_CONTROL = async (req: Request, res: Response, next: NextFunction) => {
  const authToken: string = String(req.headers.authorization);
  if (authToken) {
    try {
      const decoded = jwt.verify(authToken, process.env.ADMIN_SECRET_KEY || '');
      const myDecoded = decoded as IDecodedProps;
      if (myDecoded.wallet) {
        res.locals.wallet = myDecoded;
        return next()
      } else {
        throw new Error('Unauthorized');
      }
    } catch (err) {
      return res.status(401).json({
        error: 'Unauthorized',
        err
      });
    }
  } else {
    return res.status(401).json({
      error: 'Unauthorized'
    });
  }
};