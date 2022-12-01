// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

const partecipanti = async (req: NextApiRequest, res: NextApiResponse) => {
    const users = await prisma.user.findMany()
    return res.status(200).json(users)
}

export default partecipanti