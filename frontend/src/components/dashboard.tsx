import { useEffect, useState} from 'react';
import '../App.css';
import { connect, ConnectedProps} from 'react-redux'
import type { RootState } from '../store'


type PropsFromRedux = ConnectedProps<typeof connector>
interface AppProps extends PropsFromRedux { }

function Dashboard(props:AppProps) {
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
        Dashboard 
        { props.token?<p>hello {props.token}</p>:null }
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