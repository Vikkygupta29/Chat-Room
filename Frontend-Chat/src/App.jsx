import React from 'react'
import toast, { Toaster } from 'react-hot-toast';
import JoinCreateChat from './components/JoinCreateChat';
const App = () => {
  return (
    <div>
      <JoinCreateChat/>
      <Toaster/>
    </div>
  )
}

export default App