import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter} from 'react-router'
import './index.css'
import AppRoutes from './config/AppRoutes.jsx'
import { ChatProvider } from './context/ChatContext.jsx'

createRoot(document.getElementById('root')).render(

    <BrowserRouter>
    <ChatProvider>
 <AppRoutes/>
    </ChatProvider>
    
    </BrowserRouter>
   
 
)
