import { useEffect, useState} from 'react';
import '../App.css';
import { connect, ConnectedProps} from 'react-redux'
import QRCode from 'qrcode.react'
import type { RootState,AppDispatch } from '../store'


type PropsFromRedux = ConnectedProps<typeof connector>
interface AppProps extends PropsFromRedux { }

function Register(props:AppProps) {
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
      console.log("RESPO:", parsed)
      if (parsed.jwt) {
        setResponse(parsed.jwt)
      }
      if (parsed.email) {
        localStorage.setItem("token",parsed.email)
        props.sendToken(parsed.email)
      }
    } catch(e) {
      console.log(e)
    }
  }

  const getOffer = async () => {
    socket.send(JSON.stringify({action: "getoffer", email:email}))
  }


  return (
    <div className="App">
      <header className="App-header">
        <section>
          <div>
            <label className="emaillabel">Enter your email</label>
            <input className="emailinput" type="text" name="email" onChange={(e) => setEmail(e.target.value)} />
            <div className="emailbutton" onClick={() => getOffer()} >Register</div>
          </div>
          <div>
            {
            response ?
            <div className="emaillabel">
              <div>Scan the QRCode to receive a credential</div>
              <QRCode 
                value={response} 
                includeMargin={true}
                size={250}
                className="qrcode"
              />
              </div>
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
    token: state.login.token
  };
};
function mapDispatchToProps(dispatch:AppDispatch) {
  return {
    sendToken: (item:string) => { dispatch({type:'STORE_TOKEN', payload: item}) },
  }
}

const connector = connect(mapStateToProps, mapDispatchToProps)

export default connector(Register);