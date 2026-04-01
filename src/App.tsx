import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './pages/homepage'
import Login from './pages/auth/login'
import Signup from './pages/auth/signup'
import CoursePage from './pages/coursePage'
import VerifyPage from './pages/auth/verifyPage'
import AboutPage from './pages/about'
import TeamPage from './pages/team'
import ContactPage from './pages/contact'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/course" element={<CoursePage />} />
        <Route path="/verify" element={<VerifyPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
