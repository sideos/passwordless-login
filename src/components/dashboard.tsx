import React from 'react';
import { useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import QRCode from 'qrcode.react'

function Login() {
  const [qrcode, setQrcode] = useState('')
  const [error, setError] = useState('');
  useEffect(() => {
    const socket = new WebSocket(process.env.REACT_APP_SOCKET_URL+'/api/login/'+ process.env.REACT_APP_API_VERSION || "ws://localhost:3200/api/login")
    socket.onmessage = (e) => onMessage(e)
    socket.onerror = (e: any) => {
      setError(e)
    }
    socket.onopen = (e: any) => {
      socket.send(JSON.stringify({login: "request"}))
    }
    return function cleanup() {
      socket.close()
    }
  }, [])

  const onMessage = (message: any) => {
    try {
      const parsed = JSON.parse(message.data)
   
      
      if (parsed.qrcode) {
        setQrcode(parsed.qrcode)
      }
    } catch(e) {
    }
  }

  return (
    <div className="App">
      <header className="App-header">
      </header>
      <section>
      <QRCode 
            value={qrcode} 
            includeMargin={true}
            size={250}
            className="qrcode"
          />
      </section>
    </div>
  );
}

export default Login;