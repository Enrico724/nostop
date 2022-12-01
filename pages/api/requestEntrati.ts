// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

const entrati = async (req: NextApiRequest, res: NextApiResponse) => {
    const users = await prisma.user.findMany({where: { entrato: true }})
    return res.status(200).json(users)
}

export default entrati