import React, { useContext, useState } from 'react'
import Dashboard from './pages/Dashboard'
import Auth from './pages/Auth';
import { AuthContext } from './context/AuthContext';

const App = () => {
   const {isLoggedIn } = useContext(AuthContext);
  return (
    <div className='flex-1 h-lvh items-center justify-center' >
     
      {
        isLoggedIn?<Dashboard/> :<Auth/>
      }
     
    </div>
  )
}

export default App