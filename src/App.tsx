import React, {useContext, useEffect} from 'react';
import './App.css';
import {AppContext} from "./components/state/ContextProvider";
import {Auth} from "./components/Auth";
import Main from "./components/Main";
import {signIn} from "./firebase/firebase";
import {loginType} from "./components/state/authReducer";

function App() {

  const {login, dispatch} = useContext(AppContext);

  useEffect(()=>{
    const login = async () => {
      await signIn();
    }
    if(!!localStorage.getItem('loginState')) {
      // login();
      dispatch({type: loginType});
    }
  }, []);
  
  return (
    <div className='bg-gray-800 w-full max-h-screen min-h-screen overflow-hidden'>
      {login ? (
        <Main />
      ):(
        <Auth />
      )}
    </div>
  );
}

export default App;
