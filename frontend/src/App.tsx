import './App.css'

import Login from './components/login'
import Dashboard from './components/dashboard'
import Register from './components/register'
import { connect, Provider, ConnectedProps} from 'react-redux'
import { BrowserRouter, Route, Routes, Navigate} from 'react-router-dom'
import { FC, useEffect,useState } from 'react';
import type { RootState } from './store'


type PropsFromRedux = ConnectedProps<typeof connector>
interface AppProps extends PropsFromRedux { }

const App:FC<AppProps> = ({token}) => {

  const RequiredAuth = ({children}: { children: JSX.Element }) => {
    if (token) {
      return children
    }
    return <Navigate to="/login" replace />;
  }

  const Auth = ({children}: { children: JSX.Element }) => {
    if (!token) {
      return children
    }
    return <Navigate to="/dashboard" replace />;
  }

  return (
   
      <Routes>
        <Route path="/" element={<Auth><Login /></Auth>} /> 
        <Route path="/login" element={<Auth><Login /></Auth>} /> 
        <Route path="/dashboard" element={<RequiredAuth><Dashboard /></RequiredAuth> } />
        <Route path="/register" element={ <Auth><Register /></Auth>} /> 
      </Routes>

  );
}

const mapStateToProps = (state:RootState) => {
  return {
    token: state.login.token,
  };
};

const connector = connect(mapStateToProps)

export default connector(App);

