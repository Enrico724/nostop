import type { Server as HTTPServer } from 'http'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { Socket as NetSocket } from 'net'
import { Server as IOServer } from 'socket.io'
import { PrismaClient } from '@prisma/client'

interface SocketServer extends HTTPServer {
    io?: IOServer | undefined
}

interface SocketWithIO extends NetSocket {
    server: SocketServer
}

interface NextApiResponseWithSocket extends NextApiResponse {
    socket: SocketWithIO
}

const prisma = new PrismaClient()

const ioHandler = (req: NextApiRequest, res: NextApiResponseWithSocket) => {
  if (!res.socket.server.io) {
    console.log('*First use, starting socket.io')

    const io = new IOServer(res.socket.server)

    io.on('connection', socket => {
      socket.broadcast.emit('a user connected')

      socket.on('check:partecipante', (id, nome, cognome) => {
        prisma.user.findFirst({
          where: {
            id: id,
            nome: nome,
            cognome: cognome
          }
        }).then(
          user => {
            if (!user!.entrato) {
              prisma.user.updateMany({
                where: {
                  id: id
                },
                data: {
                  entrato: true
                }
              }).then(
                () => socket.emit('get:check:partecipante', true)
              )
            }
            socket.emit('get:check:partecipante', false)
          }
        ).finally(
          () => {
            prisma.user.findMany({where: { entrato: true }})
              .then((entrati) => socket.broadcast.emit('get:entrati', entrati))
            prisma.user.findMany({where: { entrato: false }})
              .then((nonEntrati) => socket.broadcast.emit('get:non:entrati', nonEntrati))
            prisma.user.findMany()
              .then((partecipanti) => socket.broadcast.emit('get:partecipanti', partecipanti))
            
          }
        )
      })

      socket.on('aggiungi:invitato', (nome, cognome) => {
        prisma.user.create({
          data: {
            nome: nome,
            cognome: cognome
          }
        }).then(
          () => {
            prisma.user.findMany({where: { entrato: true }})
              .then((entrati) => socket.broadcast.emit('get:entrati', entrati))
            prisma.user.findMany({where: { entrato: false }})
              .then((nonEntrati) => socket.broadcast.emit('get:non:entrati', nonEntrati))
            prisma.user.findMany()
              .then((partecipanti) => socket.broadcast.emit('get:partecipanti', partecipanti))
            
          }
        )
      })

      socket.on('request:entrati', () => {
        prisma.user.findMany({where: { entrato: true }})
          .then((entrati) => socket.emit('get:entrati', entrati))
      })

      socket.on('request:non:entrati', () => {
        prisma.user.findMany({where: { entrato: false }})
          .then((nonEntrati) => socket.emit('get:non:entrati', nonEntrati))
      })

      socket.on('request:partecipanti', () => {
        prisma.user.findMany()
          .then((partecipanti) => socket.emit('get:partecipanti', partecipanti))
      })

      socket.on('check:partecipante', (data) => {
        socket.emit('get:check:partecipante', false)
      })
    })

    res.socket.server.io = io
  } else {
    console.log('socket.io already running')
  }
  res.end()
}

export const config = {
  api: {
    bodyParser: false
  }
}

export default ioHandler