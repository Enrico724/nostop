// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { UserInfo } from '../../lib/model/User'

const prisma = new PrismaClient()

interface NextApiRequestWithUserInfo extends NextApiRequest {
  body: UserInfo
}

const checkPartecipante = async (req: NextApiRequestWithUserInfo, res: NextApiResponse) => {
  const { id, nome, cognome } = req.body;
  const users = await prisma.user.findMany({ where: { id, AND: { nome, AND: { cognome } } } })

  if (users.length === 0) return res.status(400).json(null)

  const user = users[0]
  
  if (!user.entrato) {
    await prisma.user.update({where: { id }, data: { entrato: true }})
    return res.status(200).json(true)
  }
  
  return res.status(200).json(false)
  
}

export default checkPartecipante
