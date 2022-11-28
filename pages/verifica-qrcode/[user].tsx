import { Display, Loading, Spacer } from "@geist-ui/core"
import { User } from "@prisma/client"
import Link from "next/link"
import { useRouter } from "next/router"
import React from "react"
import { ListContext } from "../../lib/contexts/AppContext"

interface UserInfo {
    id: number
    nome: string
    cognome: string
}

export default function Verifica() {
    const router = useRouter()
    const { id, nome, cognome } = JSON.parse(router.query.user as string) as unknown as UserInfo
    const { connected, checkPartecipante, responseCheckPartecipante } = React.useContext(ListContext)

    React.useEffect(() => {
        if(connected)
            checkPartecipante(id, nome, cognome)
    }, [])

    if (responseCheckPartecipante === true)
        return (
            <Display>
                <h1 style={{color: "#454B1B"}}>Fallo Entrare</h1>
                <Spacer h={3} />
                <Link href={'/qr-reader'}>Leggi altro</Link>
                <Spacer h={3} />
                <Link href={'/'}>Home</Link>
                <Spacer h={3} />
                <p>
                    {nome}
                    <br/>
                    {cognome}
                </p>
            </Display>
        )

    if (responseCheckPartecipante === false)
        return (
            <Display>
                <h1 style={{color: "#ff0000"}}>Già Entrato</h1>
                <Spacer h={3} />
                <Link href={'/qr-reader'}>Leggi altro</Link>
                <Spacer h={3} />
                <Link href={'/'}>Home</Link>
                <Spacer h={3} />
                <p>
                    {nome}
                    <br/>
                    {cognome}
                </p>
            </Display>
        )

    return (
        <Loading/>
    )

}