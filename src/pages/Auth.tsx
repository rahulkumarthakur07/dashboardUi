import React, { useState } from 'react'
import Login from './auth/Login';
import Register from './auth/Register';


const Auth= () => {
  const [isLogin, setIsLogin] = useState(true);
  return (
    <div className='flex-1 h-lvh items-center justify-center' >
      {/* <Dashboard/> */}

      {
        isLogin?<Login switchToRegister={()=>setIsLogin(false)} />:<Register switchToLogin={()=>setIsLogin(true)}  />
      }
      
    </div>
  )
}

export default Auth