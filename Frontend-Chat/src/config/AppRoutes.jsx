import React from 'react'
import { Route, Routes } from 'react-router'
import App from '../App'
import ChatPage from '../pages/ChatPage'

const AppRoutes = () => {
  return (
    <div>
        <Routes>
            <Route path='/' element={<App/>}/>
            <Route path='/chat' element={<ChatPage/>}/>
        </Routes>
    </div>
  )
}

export default AppRoutes