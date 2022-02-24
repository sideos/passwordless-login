import { useEffect, useState} from 'react';
import QRCode from 'qrcode.react'
import '../App.css';
import { connect, ConnectedProps} from 'react-redux'
import type { RootState,AppDispatch } from '../store'

type PropsFromRedux = ConnectedProps<typeof connector>
interface AppProps extends PropsFromRedux { }

function Login(props:AppProps) {
  const [qrcode, setQrcode] = useState('none')
 
  useEffect(() => {
    const socket = new WebSocket(process.env.REACT_APP_SOCKET_URL+'/api/login/')
    socket.onmessage = (e) => onMessage(e)
    socket.onerror = (e: any) => {
      
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
      console.log("Parsed:", parsed)
      if (parsed.jwt) {
        setQrcode(parsed.jwt)
      }
      if(parsed.email){
        localStorage.setItem("token",parsed.email)
        props.sendToken(parsed.email)
      }
    } catch(e) {

    }
  }

  return (
    <div className="App">
    <header className="App-header">
      <section>
        <QRCode 
            value={qrcode} 
            includeMargin={true}
            size={250}
            className="qrcode"
          />
      </section>
    </header>
  </div>
  );
}

const mapStateToProps = (state:RootState) => {
  return {
  };
};
function mapDispatchToProps(dispatch:AppDispatch) {
  return {
    sendToken: (item:string) => { dispatch({type:'STORE_TOKEN', payload: item}) },
  }
}

const connector = connect(mapStateToProps, mapDispatchToProps)

export default connector(Login);