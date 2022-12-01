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
        fetch('/api/requestPartecipanti')
            .then(res => res.json())
            .then(data => setPartecipanti(data))
        fetch('/api/requestEntrati')
            .then(res => res.json())
            .then(data => setEntrati(data))
        fetch('/api/requestNonEntrati')
            .then(res => res.json())
            .then(data => setNonEntrati(data))
    }, [])

    const checkPartecipante = (id: number, nome: string, cognome: string) => {
        fetch('/api/checkPartecipante', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id, nome, cognome})
        })
            .then(res => res.json())
            .then(data => setResponseCheckPartecipante(data))
    }

    const aggiungiInvitato = (nome: string, cognome: string) => {
        fetch('/api/aggiungiInvitato', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({nome, cognome})
        })
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
