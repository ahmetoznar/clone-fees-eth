import { database } from "../../init";

import { Request, Response, Router } from 'express';
import { Proof, Wallet } from "@prisma/client";
import { JWT_ADMIN_CONTROL, JWT_CONTROL } from "../constants/helpers";
import jwt from 'jsonwebtoken';

const router = Router();

router.get('/', JWT_ADMIN_CONTROL, async (req: Request, res: Response) => {
  const query: string = String(req.query.q);
  const skip: number = Number(req.query.skip);
  const take: number = Number(req.query.take);

  let newQuery = String(query) !== 'undefined' ? query : null;

  const count = await database.wallet.findMany();



  if (!isNaN(skip) && !isNaN(take) && newQuery !== null) {
    const wallets = await database.wallet.findMany({
      where: {
        OR: [
          {
            address: {
              contains: newQuery
            }
          }
        ]
      },
      skip,
      take,
      include: {
        proofs: true
      }
    });
    return res.status(200).json({ wallets, count: count.length });
  } else if (!isNaN(skip) && !isNaN(take) && newQuery === null) {
    const wallets = await database.wallet.findMany({
      skip,
      take,
      include: {
        proofs: true
      }
    });
    return res.status(200).json({ wallets, count: count.length });
  } else {
    const wallets = await database.wallet.findMany({
      include: {
        proofs: true
      }
    });
    return res.status(200).json({ wallets, count: count.length });
  }


});
router.get('/count', async (req: Request, res: Response) => {
  try {
    const data = await database.wallet.findMany();
    return res.status(200).json({
      count: data.length
    });
  } catch {
    return res.status(400).json({
      error: 'Something went wrong!'
    });
  }
});
router.get('/:walletAddress', JWT_CONTROL, async (req: Request, res: Response) => {
  const auth: string = String(res.locals.wallet);
  const paramWallet: string = req.params.walletAddress;

  if (auth && paramWallet) {
    if (auth.toLowerCase() === paramWallet.toLowerCase()) {
      return res.status(200).json({
        wallet: await database.wallet.findFirst({
          where: {
            address: paramWallet
          },
          include: {
            proofs: true
          }
        })
      })
    } else {
      return res.status(401).json({
        error: 'Unauthorized'
      });
    }
  } else {
    return res.status(400).json({
      error: 'Unauthorized or Missing value'
    });
  }

});
interface IDecodedProps {
  wallet: string;
}
router.post('/login', async (req: Request, res: Response) => {
  const authToken: string = String(req.headers.authorization);
  const walletAddress: string = String(req.body.walletAddress);
  if (authToken && walletAddress && walletAddress.length === 42) {
    try {
      const decoded = jwt.verify(authToken, process.env.SECRET_KEY || '');
      const myDecoded = decoded as IDecodedProps;

      if (myDecoded.wallet) {
        res.locals.wallet = myDecoded.wallet;
        return res.status(200).json({
          message: 'Logged in',
          authorization: authToken
        });
      } else {
        throw new Error('Unauthorized');
      }
    } catch (err) {
      return res.status(200).json({
        authorization: jwt.sign({ wallet: walletAddress }, process.env.SECRET_KEY || '', { expiresIn: "15d" }),
      });
    }
  } else {
    return res.status(401).json({
      error: 'Unauthorized'
    });
  }
});
router.post('/', JWT_CONTROL, async (req: Request, res: Response) => {
  const auth: string = String(res.locals.wallet);
  const wallet = req.body.wallet;
  const proofs = req.body.proofs;

  if (auth && wallet && proofs) {
    if (auth.toLowerCase() === String(wallet?.address).toLowerCase()) {
      try {
        const created = await database.wallet.create({
          data: {
            ...wallet,
            proofs: {
              create: [...proofs]
            }
          }
        });
        if (created) {
          return res.status(200).json({
            created: {
              ...created,
              proofs
            }
          });
        }
      } catch (error) {
        return res.status(400).json({
          error: "Already unlocked or server error!"
        });
      }
    } else {
      return res.status(401).json({
        error: 'Unauthorized'
      });
    }
  } else {
    return res.status(400).json({
      error: 'Unauthorized or Bad Request'
    });
  }




});

interface ICreateProofsProps {
  walletAddress: string;
  proofs: BigInt[]
}

router.post('/create/proofs', JWT_ADMIN_CONTROL, async (req: Request, res: Response) => {
  const data = req.body.data;
  async function pushArr(data: ICreateProofsProps) {
    let newProofs = [];
    for (let index = 0; index < data.proofs.length; index++) {
      var proof = data.proofs[index];
      proof = BigInt(proof.toString(16));
      newProofs.push(proof);
    }

    for (let idx = 0; idx < newProofs.length; idx++) {
      const proofItem = newProofs[idx];
      try {
        const created = await database.proof.create({
          data: {
            proofAddress: String(proofItem),
            proofWalletAddress: data.walletAddress
          },
        });
        console.log('created => ', created);
      } catch (error) {
        console.log('err => ', error);
      }
    }

  }

  for (let index = 0; index < data.length; index++) {

    pushArr(data[index]);

  }

});


router.patch('/:id', JWT_ADMIN_CONTROL, async (req: Request, res: Response) => {
  const body: Wallet = req.body;
  const address: string = String(req.params.id);
  return await database.wallet.update({ data: { ...body }, where: { address } });
});

router.delete('/:id', JWT_ADMIN_CONTROL, async (req: Request, res: Response) => {
  const address: string = String(req.params.id);
  return await database.wallet.delete({
    where: {
      address
    }
  });
});

export default router;