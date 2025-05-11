import { BrowserRouter,Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/home'
import Landing from './pages/landing'
import AuthCheck from './pages/auth' 
import ProtectedRoute from './pages/auth'

function App() {

  return (
    <>
      {/* <h1>yosimoshi</h1> */}
      <BrowserRouter>
        <Routes>
        <Route path ='/' element={<AuthCheck/>} />
          <Route path ='/landing' element={<Landing/>} />
          {/* <Route path='/home' element={<Home/>}/> */}
          {/* Protected Route: Wrap paths that require authentication */}
        <Route element={<ProtectedRoute redirectPath="/landing" />}>
          {/* Any routes nested here will only render if authenticated */}
          <Route path='/home' element={<Home />} />
          {/* Add other protected routes here:
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/profile' element={<Profile />} />
          */}
        </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
