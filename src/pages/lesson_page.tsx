

import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import Header from './components/header'
import logo from '../assets/logo.png'
import { BASE_URL } from '../services/api'

const premiumBlue = '#081A2C'

type LessonDetails = {
  id: number
  section_id: number
  title: string
  type: string
  text_content: string | null
  video_url: string | null
  video_duration_minutes: number | null
  sort_order: number
}

const LessonPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { lessonId } = useParams()
  const [isMobile, setIsMobile] = useState(false)
  const [currentUser, setCurrentUser] = useState<{
    id?: number
    name?: string
    username?: string
    email?: string
  } | null>(() => {
    const rawUser = localStorage.getItem('current_user')
    if (!rawUser) return null

    try {
      return JSON.parse(rawUser)
    } catch {
      return null
    }
  })
  const [lesson, setLesson] = useState<LessonDetails | null>(null)
  const [isLoadingLesson, setIsLoadingLesson] = useState(true)
  const [isCompleting, setIsCompleting] = useState(false)
  const [completionMessage, setCompletionMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search])
  const programSlug = searchParams.get('slug')
  const sectionId = searchParams.get('section')

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('current_user')
    setCurrentUser(null)
    window.location.reload()
  }

  useEffect(() => {
    const updateViewport = () => {
      setIsMobile(window.innerWidth < 900)
    }

    updateViewport()
    window.addEventListener('resize', updateViewport)

    return () => {
      window.removeEventListener('resize', updateViewport)
    }
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('access_token')

    if (!lessonId) {
      setErrorMessage('Lesson not found.')
      setIsLoadingLesson(false)
      return
    }

    if (!token) {
      navigate('/login')
      return
    }

    const controller = new AbortController()

    const fetchLesson = async () => {
      setErrorMessage('')
      setCompletionMessage('')
      setIsLoadingLesson(true)

      try {
        const language = (navigator.language || 'en').slice(0, 2)
        const locale = ['en', 'ar', 'nl'].includes(language) ? language : 'en'

        const response = await fetch(`${BASE_URL}/api/lessons/${lessonId}`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Accept-Language': locale,
            Authorization: `Bearer ${token}`
          },
          signal: controller.signal
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data?.message || 'Failed to load lesson.')
        }

        setLesson(data?.data || null)
      } catch (error) {
        if ((error as Error).name === 'AbortError') return
        setErrorMessage(error instanceof Error ? error.message : 'Failed to load lesson.')
        setLesson(null)
      } finally {
        setIsLoadingLesson(false)
      }
    }

    fetchLesson()

    return () => {
      controller.abort()
    }
  }, [lessonId, navigate])

  const handleCompleteLesson = async () => {
    const token = localStorage.getItem('access_token')

    if (!lessonId || !token) {
      setErrorMessage('You must be signed in to complete this lesson.')
      return
    }

    setIsCompleting(true)
    setErrorMessage('')
    setCompletionMessage('')

    try {
      const response = await fetch(`${BASE_URL}/api/lessons/${lessonId}/complete`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.message || 'Failed to complete lesson.')
      }

      setCompletionMessage(data?.message || 'Lesson marked as completed.')
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to complete lesson.')
    } finally {
      setIsCompleting(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at top, rgba(217,181,109,0.16), transparent 22%), linear-gradient(180deg, #f8f3ea 0%, #f3ede4 52%, #efe7dc 100%)',
        color: '#101828'
      }}
    >
      <Header currentUser={currentUser} isMobile={isMobile} onLogout={handleLogout} logoSrc={logo} />

      <div
        style={{
          width: 'min(1240px, calc(100% - 32px))',
          margin: '0 auto',
          padding: isMobile ? '28px 0 48px' : '40px 0 56px',
          display: 'grid',
          gap: '24px'
        }}
      >
        <button
          type="button"
          onClick={() => {
            if (programSlug) {
              navigate(`/learn/${programSlug}`)
            } else {
              navigate('/course')
            }
          }}
          style={{
            width: 'fit-content',
            padding: '10px 16px',
            borderRadius: '999px',
            border: '1px solid rgba(8,26,44,0.10)',
            background: '#ffffff',
            color: premiumBlue,
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          ← Back to Course
        </button>

        {isLoadingLesson ? (
          <div
            style={{
              display: 'grid',
              gap: '20px'
            }}
          >
            <div
              style={{
                height: '180px',
                borderRadius: '28px',
                background: 'linear-gradient(135deg, rgba(8,26,44,0.10) 0%, rgba(13,39,66,0.12) 55%, rgba(217,181,109,0.20) 140%)'
              }}
            />
            <div
              style={{
                height: '420px',
                borderRadius: '28px',
                background: 'rgba(255,255,255,0.75)',
                border: '1px solid rgba(8,26,44,0.06)'
              }}
            />
          </div>
        ) : errorMessage && !lesson ? (
          <div
            style={{
              padding: '24px',
              borderRadius: '22px',
              border: '1px solid rgba(220, 38, 38, 0.18)',
              background: 'rgba(220, 38, 38, 0.05)',
              color: '#991b1b',
              lineHeight: 1.7
            }}
          >
            {errorMessage}
          </div>
        ) : lesson ? (
          <>
            <div
              style={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '30px',
                minHeight: isMobile ? '220px' : '260px',
                background: 'linear-gradient(135deg, rgba(8,26,44,0.96) 0%, rgba(13,39,66,0.92) 55%, rgba(217,181,109,0.75) 140%)',
                boxShadow: '0 24px 55px rgba(15, 23, 42, 0.10)'
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'radial-gradient(circle at top right, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0) 34%)'
                }}
              />

              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: isMobile ? '22px' : '34px',
                  gap: '12px'
                }}
              >
                <div
                  style={{
                    display: 'inline-flex',
                    width: 'fit-content',
                    alignItems: 'center',
                    padding: '8px 14px',
                    borderRadius: '999px',
                    background: 'rgba(255,255,255,0.14)',
                    color: '#ffffff',
                    fontSize: '12px',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    backdropFilter: 'blur(8px)'
                  }}
                >
                  Lesson {lesson.sort_order}
                </div>

                <h1
                  style={{
                    margin: 0,
                    color: '#ffffff',
                    fontSize: isMobile ? '34px' : '48px',
                    lineHeight: 1,
                    letterSpacing: '-0.04em',
                    maxWidth: '760px'
                  }}
                >
                  {lesson.title}
                </h1>

                <p
                  style={{
                    margin: 0,
                    color: 'rgba(255,255,255,0.84)',
                    fontSize: isMobile ? '16px' : '18px',
                    lineHeight: 1.8,
                    maxWidth: '760px'
                  }}
                >
                  {lesson.type}
                  {lesson.video_duration_minutes ? ` • ${lesson.video_duration_minutes} min` : ''}
                  {sectionId ? ` • Section ${sectionId}` : ''}
                </p>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 1fr) 320px',
                gap: '24px',
                alignItems: 'start'
              }}
            >
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, #fff9ef 100%)',
                  borderRadius: '28px',
                  padding: isMobile ? '24px 20px' : '30px',
                  boxShadow: '0 18px 40px rgba(15, 23, 42, 0.08)',
                  border: '1px solid rgba(8,26,44,0.06)',
                  display: 'grid',
                  gap: '22px'
                }}
              >
                {lesson.video_url && (
                  <div>
                    <div
                      style={{
                        fontSize: '12px',
                        letterSpacing: '0.16em',
                        textTransform: 'uppercase',
                        color: '#9b8660',
                        fontWeight: 800,
                        marginBottom: '10px'
                      }}
                    >
                      Video Lesson
                    </div>
                    <div
                      style={{
                        borderRadius: '24px',
                        overflow: 'hidden',
                        background: '#000000',
                        minHeight: isMobile ? '220px' : '380px'
                      }}
                    >
                      <video
                        controls
                        style={{
                          width: '100%',
                          height: '100%',
                          display: 'block'
                        }}
                      >
                        <source src={lesson.video_url} />
                      </video>
                    </div>
                  </div>
                )}

                <div>
                  <div
                    style={{
                      fontSize: '12px',
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      color: '#9b8660',
                      fontWeight: 800,
                      marginBottom: '10px'
                    }}
                  >
                    Lesson Content
                  </div>
                  <div
                    style={{
                      color: '#555',
                      lineHeight: 1.9,
                      fontSize: '15px',
                      whiteSpace: 'pre-wrap'
                    }}
                  >
                    {lesson.text_content || 'No text content available for this lesson.'}
                  </div>
                </div>
              </div>

              <div
                style={{
                  background: '#ffffff',
                  borderRadius: '28px',
                  padding: isMobile ? '24px 20px' : '28px',
                  border: '1px solid rgba(8,26,44,0.08)',
                  boxShadow: '0 16px 35px rgba(15, 23, 42, 0.06)',
                  display: 'grid',
                  gap: '14px'
                }}
              >
                <div
                  style={{
                    fontSize: '12px',
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: '#9b8660',
                    fontWeight: 800,
                    marginBottom: '6px'
                  }}
                >
                  Lesson Actions
                </div>

                <div style={{ color: premiumBlue, fontSize: '24px', fontWeight: 800, lineHeight: 1.2 }}>
                  Stay on track with your progress
                </div>

                <div style={{ color: '#6b7280', lineHeight: 1.8, fontSize: '14px' }}>
                  Complete this lesson after reviewing the content to unlock progress toward the section quiz.
                </div>

                {errorMessage && lesson && (
                  <div
                    style={{
                      padding: '14px 16px',
                      borderRadius: '16px',
                      border: '1px solid rgba(220, 38, 38, 0.18)',
                      background: 'rgba(220, 38, 38, 0.05)',
                      color: '#991b1b',
                      fontSize: '14px',
                      lineHeight: 1.7
                    }}
                  >
                    {errorMessage}
                  </div>
                )}

                {completionMessage && (
                  <div
                    style={{
                      padding: '14px 16px',
                      borderRadius: '16px',
                      border: '1px solid rgba(34, 197, 94, 0.18)',
                      background: 'rgba(34, 197, 94, 0.06)',
                      color: '#166534',
                      fontSize: '14px',
                      lineHeight: 1.7
                    }}
                  >
                    {completionMessage}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleCompleteLesson}
                  disabled={isCompleting}
                  style={{
                    height: '54px',
                    borderRadius: '999px',
                    border: 'none',
                    background: premiumBlue,
                    color: '#ffffff',
                    fontWeight: 800,
                    cursor: isCompleting ? 'not-allowed' : 'pointer',
                    opacity: isCompleting ? 0.65 : 1
                  }}
                >
                  {isCompleting ? 'Marking as Complete...' : 'Mark Lesson as Complete'}
                </button>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}

export default LessonPage