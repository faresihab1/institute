import { useEffect } from 'react'
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams
} from 'react-router-dom'
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
import { appRoutes, getCurrentPath, getRedirectLoginPath } from './routes'
import ErrorBoundary from './ErrorBoundary'

const ScrollToTop = () => {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return null
}

const RequireAuth = () => {
  const location = useLocation()
  const token = localStorage.getItem('access_token')

  if (!token) {
    return <Navigate to={getRedirectLoginPath(getCurrentPath(location.pathname, location.search))} replace />
  }

  return <Outlet />
}

const LegacyLessonRedirect = () => {
  const { lessonId } = useParams()
  const [searchParams] = useSearchParams()
  const slug = searchParams.get('slug')
  const sectionId = searchParams.get('section')

  if (!lessonId || !slug) {
    return <Navigate to={appRoutes.courses} replace />
  }

  return <Navigate to={appRoutes.lesson(slug, lessonId, sectionId)} replace />
}

const LegacyQuizRedirect = () => {
  const { sectionId } = useParams()
  const [searchParams] = useSearchParams()
  const slug = searchParams.get('slug')

  if (!sectionId || !slug) {
    return <Navigate to={appRoutes.courses} replace />
  }

  return <Navigate to={appRoutes.quiz(slug, sectionId)} replace />
}

const NotFoundPage = () => {
  const navigate = useNavigate()

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: '24px',
        background:
          'radial-gradient(circle at top, rgba(217,181,109,0.18), transparent 22%), linear-gradient(180deg, #f8f3ea 0%, #f3ede4 52%, #efe7dc 100%)'
      }}
    >
      <div
        style={{
          width: 'min(520px, 100%)',
          padding: '36px',
          borderRadius: '28px',
          background: '#ffffff',
          border: '1px solid rgba(8,26,44,0.08)',
          boxShadow: '0 24px 56px rgba(15, 23, 42, 0.08)',
          textAlign: 'center'
        }}
      >
        <div
          style={{
            color: '#9b8660',
            fontSize: '12px',
            fontWeight: 800,
            letterSpacing: '0.16em',
            textTransform: 'uppercase'
          }}
        >
          Page Not Found
        </div>
        <h1
          style={{
            margin: '14px 0 12px',
            color: '#081A2C',
            fontSize: '40px',
            lineHeight: 1.05,
            letterSpacing: '-0.03em'
          }}
        >
          This route does not exist
        </h1>
        <p
          style={{
            margin: 0,
            color: '#5f5a54',
            lineHeight: 1.8
          }}
        >
          The page may have moved, or the link is incomplete. Return to the course catalog and continue from there.
        </p>
        <button
          type="button"
          onClick={() => navigate(appRoutes.courses)}
          style={{
            marginTop: '24px',
            padding: '12px 20px',
            borderRadius: '999px',
            border: 'none',
            background: '#081A2C',
            color: '#ffffff',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Browse Courses
        </button>
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <Routes>
          <Route path={appRoutes.home} element={<HomePage />} />
          <Route path={appRoutes.login} element={<Login />} />
          <Route path={appRoutes.signup} element={<Signup />} />
          <Route path={appRoutes.courses} element={<CoursePage />} />
          <Route path={appRoutes.courseDetails(':slug')} element={<CourseDetailsPage />} />
          <Route path={appRoutes.verify} element={<VerifyPage />} />
          <Route path={appRoutes.about} element={<AboutPage />} />
          <Route path={appRoutes.team} element={<TeamPage />} />
          <Route path={appRoutes.contact} element={<ContactPage />} />
          <Route path={appRoutes.legacyLesson(':lessonId')} element={<LegacyLessonRedirect />} />
          <Route path={appRoutes.legacyQuiz(':sectionId')} element={<LegacyQuizRedirect />} />

          <Route element={<RequireAuth />}>
            <Route path={appRoutes.courseLearning(':slug')} element={<CourseLearningPage />} />
            <Route path={appRoutes.lesson(':slug', ':lessonId')} element={<LessonPage />} />
            <Route path={appRoutes.quiz(':slug', ':sectionId')} element={<QuizPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  )
}

export default App
