import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './pages/homepage'
import Login from './pages/auth/login'
import Signup from './pages/auth/signup'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
