import { useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/Routes'
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
function App() {
  console.log('App');
  return (
    <>          
      <BrowserRouter>        
        <AppRoutes />        
      </BrowserRouter>        
    </>
  )
}

export default App
