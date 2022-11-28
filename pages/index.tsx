import { Page, Button, Divider, Spacer, Dot, Table } from '@geist-ui/core'
import { Maximize, Users } from '@geist-ui/icons'
import Link from 'next/link'
import React from 'react'
import { ListContext } from '../lib/contexts/AppContext'

export default function Home() {
  const { entrati, nonEntrati } = React.useContext(ListContext)

  return (
    <Page style={{minWidth: "360px"}}>
      <Link href="/qr-reader" passHref>
        <Button icon={<Maximize />} width="100%">Scannerizza Invito</Button>
      </Link>
      <Spacer h={.5} />
      <Link href="/lista-invitati" passHref>
        <Button icon={<Users />} width="100%">Lista Invitati</Button>
      </Link>
      <Spacer h={2} />
      <Divider>
        <Dot style={{ marginRight: '20px' }} type="success">Entrati</Dot>
      </Divider>
      <Spacer h={.5} />
      <Table data={entrati}>
        <Table.Column prop="nome" label='nome'/>
        <Table.Column prop="cognome" label='cognome'/>
      </Table>
      <Spacer h={2} />
      <Divider>
        <Dot style={{ marginRight: '20px' }} type="error">Non Entrati</Dot>
      </Divider>
      <Spacer h={.5} />
      <Table data={nonEntrati}>
        <Table.Column prop="nome" label='nome'/>
        <Table.Column prop="cognome" label='cognome'/>
      </Table>
    </Page>
  )
}
