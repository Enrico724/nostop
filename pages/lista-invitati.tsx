import React, { useState } from "react";
import { Button, Loading, Modal, Page, Spacer, Table } from "@geist-ui/core";
import QRCode from "react-qr-code";
import { ListContext } from "../lib/contexts/AppContext";
import canvasToImage from 'canvas-to-image';
import html2canvas from "html2canvas";

export default function Scan() {
  const { partecipanti } = React.useContext(ListContext)
  const [ isVisible, setIsVisible ] = React.useState(false)
  const [qrCodeValue, setQrCodeValue] = React.useState("");

  const renderAction = (value, rowData, index) => {
    const viewQrCode = () => {
      const {id, nome, cognome} = rowData
      setQrCodeValue(JSON.stringify({id, nome, cognome}))
      setIsVisible(true)
    }
    return (
      <>
        <Button type="default" auto scale={1/3} font="12px" onClick={viewQrCode}>Visualizza QR Code</Button>
        <Modal visible={isVisible} onClose={() => setIsVisible(false)}>
          <Modal.Title>QR Code</Modal.Title>
          <Spacer h={1} />
          <Modal.Content id='print' style={{backgroundColor: '#ffffff', margin: '0 auto 0 auto'}} >
            {qrCodeValue != "" && (
              <QRCode value={qrCodeValue} style={{
                display: 'flex',
                flexDirection: 'column'
              }} />
            )}
          </Modal.Content>
          <Modal.Action passive onClick={() => setIsVisible(false)}>Cancel</Modal.Action>
          <Modal.Action onClick={async () => {
            function dataURItoBlob(dataURI: string) {
              // convert base64 to raw binary data held in a string
              // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
              var byteString = atob(dataURI.split(',')[1]);
          
              // separate out the mime component
              var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
          
              // write the bytes of the string to an ArrayBuffer
              var ab = new ArrayBuffer(byteString.length);
              var ia = new Uint8Array(ab);
              for (var i = 0; i < byteString.length; i++) {
                  ia[i] = byteString.charCodeAt(i);
              }
              return new Blob([ab], {type: mimeString});
            }

            if(navigator.share) {
              const element = document.getElementById('print')
              const canvas = await html2canvas(element!)
              const image = canvas.toDataURL("image/jpeg", 1.0);
              const file = dataURItoBlob(image)

              navigator.share({
                files: [new File([file], 'QrCode.jpeg')]
              })
          }}}>Condividi QR Code</Modal.Action>
        </Modal>
      </>
    )
  }

  return (
    <Page style={{minWidth: "360px"}}>
      <Table data={partecipanti}>
        <Table.Column prop="nome" label='nome'/>
        <Table.Column prop="cognome" label='cognome'/>
        <Table.Column prop="operation" label="operation" width={150} render={renderAction} />
      </Table>
    </Page>
  );
}
