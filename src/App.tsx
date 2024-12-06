import { useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/Routes'
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import { AuthProvider } from './context/AuthContext';
function App() {
  console.log('App');
  return (
    <>      
      <AuthProvider>
        <BrowserRouter>        
          <AppRoutes />        
        </BrowserRouter>      
      </AuthProvider>
    </>
  )
}

export default App
