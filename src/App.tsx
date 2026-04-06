import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './pages/homepage'
import Login from './pages/auth/login'
import Signup from './pages/auth/signup'
import CoursePage from './pages/coursePage'
import VerifyPage from './pages/auth/verifyPage'
import AboutPage from './pages/about'
import TeamPage from './pages/team'
import ContactPage from './pages/contact'
import CourseDetailsPage from './pages/course_details'
import CourseLearningPage from './pages/course'
import LessonPage from './pages/lesson_page'
import QuizPage from './pages/quiz_page'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/course" element={<CoursePage />} />
        <Route path="/course/:slug" element={<CourseDetailsPage />} />
        <Route path="/learn/:slug" element={<CourseLearningPage />} />
        <Route path="/lesson/:lessonId" element={<LessonPage />} />
        <Route path="/quiz/:sectionId" element={<QuizPage />} />
        <Route path="/verify" element={<VerifyPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
