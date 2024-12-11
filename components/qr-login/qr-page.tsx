'use client'
import {useEffect, useState} from "react";

import axios from "axios"
// import apis from "../apis/auth"
import QRCode from "react-qr-code";

import Router from 'next/router';

import Pusher from "pusher-js"

const initPusher = () => {
    Pusher.logToConsole = false;
    return new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
       // Specify the Pusher cluster (in this case, Asia Pacific 2)
       cluster: 'mt1',
       // Configure channel authorization
        // channelAuthorization: {
        //     // Specify an endpoint for authorizing private/presence channels
        //     endpoint: 
        // },
    })
}



const QRPage = () => {
    const [qr_data, setQrData] = useState(null)
    const [isLoading, setLoading] = useState(false)

    const getQRCode = async () => {
        try {
            let res = await axios.get('api/generate-qr');
            setQrData(res.data.data)
            console.log(res.data.data,'');
            
            return res.data.data
        } catch (e) {
            alert("Cannot fetch QR Data")
        }
        return null
    }

    
  return (
    <div>
      
    </div>
  )
}

export default QRPage
