import './App.css'
import Login from './components/login'
import Dashboard from './components/dashboard'
import Register from './components/register'
import { connect, Provider, ConnectedProps} from 'react-redux'
import { BrowserRouter, Route, Routes} from 'react-router-dom'
import { FC } from 'react';
import type { RootState } from './store'


type PropsFromRedux = ConnectedProps<typeof connector>
interface AppProps extends PropsFromRedux { }

const App:FC<AppProps> = (props:AppProps) => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={props.token ? <Dashboard /> : <Login />} /> 
        <Route path="/login" element={props.token ? <Dashboard /> : <Login />} /> 
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/register" element={ <Register /> } /> 
      </Routes>
    </BrowserRouter>
  );
}

const mapStateToProps = (state:RootState) => {
  return {
    token: state.login.token,
  };
};

const connector = connect(mapStateToProps)

export default connector(App);

