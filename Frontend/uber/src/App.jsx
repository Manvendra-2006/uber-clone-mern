import React from 'react'
import Home from './Pages/Home'
import UserLogin from './Pages/userLogin'
import UserSignup from './Pages/userSignup'
import CaptainLogin from './Pages/CaptainLogin'
import CaptainSignup from './Pages/CaptainSignup'
import {BrowserRouter,Routes,Route} from 'react-router-dom'

const App = () => {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/userlogin" element={<UserLogin/>}/>
        <Route path="/usersignup" element={<UserSignup/>}/>
        <Route path="/captainlogin" element={<CaptainLogin/>}/>
        <Route path="/captainsignup" element={<CaptainSignup/>}/>
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App