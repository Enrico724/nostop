import React, { useState } from "react";
import { Loading, Page, Spacer } from "@geist-ui/core";
import { useRouter } from 'next/router'
import dynamic from "next/dynamic";
const QrReader = dynamic(() => import('react-qr-reader'), { ssr: false })

export default function Scan() {
  const router = useRouter()

  return (
    <Page style={{minWidth: "360px"}}>
        <p style={{textAlign: 'center'}}>Inquadra il QR Code</p>
        <Spacer h={3} />
        <QrReader
          onScan={(data) => {
            if (data !== null)
              router.push(`/verifica-qrcode/${data}`)
            } 
          }
          onError={() => null}
          facingMode="environment"
        />
        <Spacer h={3} />
        <p style={{textAlign: 'center'}}><Loading/></p>
    </Page>
  );
}
