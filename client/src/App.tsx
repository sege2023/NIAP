import { BrowserRouter,Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/home'
import Landing from './pages/landing'

function App() {

  return (
    <>
      {/* <h1>yosimoshi</h1> */}
      <BrowserRouter>
        <Routes>
          <Route path ='/' element={<Landing/>} />
          <Route path='/' element={<Home/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
