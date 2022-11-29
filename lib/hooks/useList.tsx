import { User } from "@prisma/client"
import { io, Socket } from "socket.io-client";
import React from "react"
import { DefaultEventsMap } from "@socket.io/component-emitter";

interface List {
    entrati: User[]
    nonEntrati: User[]
    partecipanti: User[]
    connected: boolean
    checkPartecipante: (id: number, nome: string, cognome: string) => void
    responseCheckPartecipante: boolean | null
    aggiungiInvitato: (nome: string, cognome: string) => void
}

const useList = (): List => {
    const [connected, isConnected] = React.useState<boolean>(false);
    const [entrati, setEntrati] = React.useState<User[]>([]);
    const [nonEntrati, setNonEntrati] = React.useState<User[]>([]);
    const [partecipanti, setPartecipanti] = React.useState<User[]>([]);
    const [responseCheckPartecipante, setResponseCheckPartecipante] = React.useState<boolean | null>(null);
    let socket: Socket<DefaultEventsMap, DefaultEventsMap>

    React.useEffect(() => {
        fetch('/api/socketio').then(
            () => {
                socket = io()
                socketInitializer()
            }
        )

        return () => {
            socket.off('connect');
            socket.off('get:entrati');
            socket.off('get:partecipanti');
            socket.off('get:non:entrati');
            socket.off('get:check:partecipante');
          };
    }, [])

    const socketInitializer = async () => {
        await fetch('/api/socketio')
        socket = io()
        
        socket.on('connect', () => {
            isConnected(true)
            socket.emit('request:partecipanti')
            socket.emit('request:entrati')
            socket.emit('request:non:entrati')
        })

        socket.on('get:entrati', (data) => {
            setEntrati(data)
        })

        socket.on('get:partecipanti', (data) => {
            setPartecipanti(data)
        })

        socket.on('get:non:entrati', (data) => {
            setNonEntrati(data)
        })

        socket.on('get:check:partecipante', (data) => {
            setResponseCheckPartecipante(data)
        })
    }

    const checkPartecipante = (id: number, nome: string, cognome: string) => {
        if (connected)
            setTimeout(async () => {
                await socketInitializer()
                socket.emit('check:partecipante', id, nome, cognome)
        }, 500);
    }

    const aggiungiInvitato = (nome: string, cognome: string) => {
        if (connected)
            setTimeout(async () => {
                await socketInitializer()
                socket.emit('aggiungi:invitato', nome, cognome)
        }, 500);
    }

    return {
        entrati,
        nonEntrati,
        partecipanti,
        responseCheckPartecipante,
        checkPartecipante,
        connected,
        aggiungiInvitato

    }
}

export {
    useList
};

export type { List };
