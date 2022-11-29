import { Page, Button, Divider, Spacer, Dot, Table, Modal, Input } from '@geist-ui/core'
import { Maximize, UserPlus, Users } from '@geist-ui/icons'
import Link from 'next/link'
import React from 'react'
import { ListContext } from '../lib/contexts/AppContext'

type UserData = {
  nome: string;
  cognome: string;
}

export default function Home() {
  const [userData, setUserData] = React.useState<UserData>({nome: '', cognome: ''})
  const [visible, isVisible] = React.useState(false)
  const { entrati, nonEntrati, aggiungiInvitato } = React.useContext(ListContext)

  return (
    <Page style={{minWidth: "360px"}}>
      <Link href="/qr-reader" passHref>
        <Button icon={<Maximize />} width="100%">Scannerizza Invito</Button>
      </Link>
      <Spacer h={.5} />
      <Link href="/lista-invitati" passHref>
        <Button icon={<Users />} width="100%">Lista Invitati</Button>
      </Link>
      <Spacer h={.5} />
      <Button onClick={() => isVisible(true)} icon={<UserPlus />} width="100%">Aggiungi Invitato</Button>
      <Modal visible={visible} onClose={() => isVisible(false)}>
        <Modal.Title>Aggiungi Invitato</Modal.Title>
        <Modal.Content>
          <Input 
            placeholder="Nome" 
            onChange={(e) => {
              setUserData({
                nome: e.target.value,
                cognome: userData.cognome,
              })
            }} />
          <Input 
            placeholder="Cognome" 
            onChange={(e) => {
              setUserData({
                nome: userData.nome,
                cognome: e.target.value,
              })
            }} />
        </Modal.Content>
        <Modal.Action passive onClick={() => isVisible(false)}>Annulla</Modal.Action>
        <Modal.Action onClick={() => {
          aggiungiInvitato(userData.nome, userData.cognome)
          setUserData({nome: '', cognome: ''})
          isVisible(false)
        }}>Crea</Modal.Action>
      </Modal>
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
