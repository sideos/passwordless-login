import { useEffect, useState} from 'react';
import '../App.css';
import { connect, ConnectedProps} from 'react-redux'
import { Navigate, useNavigate  } from 'react-router-dom';
import type { RootState,AppDispatch } from '../store'


type PropsFromRedux = ConnectedProps<typeof connector>
interface AppProps extends PropsFromRedux { }

function Dashboard(props:AppProps) {
  const [qrcode, setQrcode] = useState('')
  const navigate = useNavigate()
  
  return (
    <div className="App">
      <header className="App-header">
        <section>
          <div onClick={() => props.logout()}>Logout</div>
        </section>
        <section>
          <div> Dashboard { props.token?<p>hello {props.token}</p>:null }</div>
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

function mapDispatchToProps(dispatch:AppDispatch) {
  return {
    logout: () => { dispatch({type:'LOGOUT', payload: {}}) },
  }
}

const connector = connect(mapStateToProps, mapDispatchToProps)

export default connector(Dashboard);