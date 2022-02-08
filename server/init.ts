import { PrismaClient } from '@prisma/client'
import express from 'express';
import wallet from './prisma/app/wallet';
export const initApp = async () => {
  const app = express();
  app.use(express.json());
  app.use(require('cors')());
  app.use('/api/wallet', wallet);
  app.listen(2001, () => {
    console.log('Server is running on 2001 port');
  });
};

export const database = new PrismaClient();