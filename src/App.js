import React from 'react'

import { Route,Routes } from 'react-router-dom'
import Home from './Pages/Home'
import { Navbar } from './components/common/Navbar'
import Login from './Pages/Login'

const App = () => {
  return (
   <div className='w-screen min-h-screen bg-richblack-900 flex flex-col font-inter'>
    <Navbar/>
   <Routes>
      <Route path='/' element={<Home/>}></Route>
      <Route path='/login' element={<Login/>}></Route>}
   </Routes>
   </div>
  )
}

export default App