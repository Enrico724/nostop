// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { UserData } from '../../lib/model/User'

interface NextApiRequestWithUserData extends NextApiRequest {
  body: UserData
}

const prisma = new PrismaClient()

const hello = async (req: NextApiRequestWithUserData, res: NextApiResponse) => {
  const { nome, cognome } = req.body;
  
  const user = await prisma.user.create({
    data: {
      nome: nome,
      cognome: cognome
    }
  })

  return res.status(200).json(user)
}

export default hello
