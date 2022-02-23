import { useEffect, useState} from 'react';
import '../App.css';
import { connect, ConnectedProps} from 'react-redux'
import type { RootState } from '../store'
import QRCode from 'qrcode.react'
import axios from 'axios'

type PropsFromRedux = ConnectedProps<typeof connector>
interface AppProps extends PropsFromRedux { }

function Dashboard(props:AppProps) {
  const [qrcode, setQrcode] = useState('')
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [response, setResponse] = useState(null);
  const [socket, setSocket] = useState<WebSocket>({} as WebSocket);

  useEffect(() => {
    const socket = new WebSocket(process.env.REACT_APP_SOCKET_URL+'/api/registration/')
    socket.onmessage = (e) => onMessage(e)
    socket.onerror = (e: any) => {
      setError(e)
    }

    socket.onopen = (e: any) => {
      setSocket(socket)
    }

    return function cleanup() {
      socket.close()
    }
  }, [])

  const onMessage = (message: any) => {
    try {
      const parsed = JSON.parse(message.data)
  
      if (parsed.qrcode) {
        setResponse(parsed.jwt)
      }
    } catch(e) {
    }
  }

  const getOffer = async () => {
    socket.send(JSON.stringify({action: "getoffer"}))
  }


  return (
    <div className="App">
      <header className="App-header">
        <section>
          <div>
            <input type="text" name="email" onChange={(e) => setEmail(e.target.value)} />
            <div onClick={() => getOffer()} >Register</div>
          </div>
          <div>
            {
            response ?
              <QRCode 
                value={qrcode} 
                includeMargin={true}
                size={250}
                className="qrcode"
              />
              : null
            }
          </div>
        </section>
      </header>
    </div>
  );
}

const mapStateToProps = (state:RootState) => {
  return {
    token: state.login.token,
  };
};

const connector = connect(mapStateToProps)

export default connector(Dashboard);