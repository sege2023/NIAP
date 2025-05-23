import { BrowserRouter,Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/home'
import Landing from './pages/landing'
// import AuthCheck from './pages/p' 
import AuthCheck from './pages/auth'
import ProtectedRoute from './pages/protected'

function App() {

  return (
    <>

      <BrowserRouter>
        <Routes>
        <Route path ='/' element={<AuthCheck/>} />
        <Route path ='/landing' element={<Landing/>} />
        <Route element={<ProtectedRoute redirectPath="/landing" />}>
          <Route path='/home' element={<Home />} />
        </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
