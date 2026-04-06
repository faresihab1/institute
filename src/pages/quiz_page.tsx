import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import Header from './components/header'
import logo from '../assets/logo.png'
import { BASE_URL } from '../services/api'

const premiumBlue = '#081A2C'

type QuizOption = {
  id: number
  option_text: string
}

type QuizQuestion = {
  id: number
  question_text: string
  options: QuizOption[]
}

type QuizData = {
  quiz_id: number
  title: string
  pass_percentage: number
  questions: QuizQuestion[]
}

const QuizPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { sectionId } = useParams()
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
  const [quiz, setQuiz] = useState<QuizData | null>(null)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<{
    message: string
    score?: number
    passed?: boolean
    passPercentage?: number
  } | null>(null)
  const [errorMessage, setErrorMessage] = useState('')

  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search])
  const programSlug = searchParams.get('slug')

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

    if (!sectionId) {
      setErrorMessage('Quiz not found.')
      setIsLoadingQuiz(false)
      return
    }

    if (!token) {
      navigate('/login')
      return
    }

    const controller = new AbortController()

    const fetchQuiz = async () => {
      setErrorMessage('')
      setSubmitResult(null)
      setIsLoadingQuiz(true)

      try {
        const language = (navigator.language || 'en').slice(0, 2)
        const locale = ['en', 'ar', 'nl'].includes(language) ? language : 'en'

        const response = await fetch(`${BASE_URL}/api/sections/${sectionId}/quiz`, {
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
          throw new Error(data?.message || 'Failed to load quiz.')
        }

        setQuiz(data?.data || null)
      } catch (error) {
        if ((error as Error).name === 'AbortError') return
        setErrorMessage(error instanceof Error ? error.message : 'Failed to load quiz.')
        setQuiz(null)
      } finally {
        setIsLoadingQuiz(false)
      }
    }

    fetchQuiz()

    return () => {
      controller.abort()
    }
  }, [navigate, sectionId])

  const handleSelectAnswer = (questionId: number, optionId: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId
    }))
  }

  const handleSubmitQuiz = async () => {
    const token = localStorage.getItem('access_token')

    if (!sectionId || !token || !quiz) {
      setErrorMessage('Quiz is not ready yet.')
      return
    }

    if (quiz.questions.some((question) => !answers[question.id])) {
      setErrorMessage('Please answer all questions before submitting.')
      return
    }

    setIsSubmitting(true)
    setErrorMessage('')
    setSubmitResult(null)

    try {
      const response = await fetch(`${BASE_URL}/api/sections/${sectionId}/quiz/submit`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ answers })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.message || 'Failed to submit quiz.')
      }

      setSubmitResult({
        message: data?.message || 'Quiz submitted successfully.',
        score: data?.data?.score,
        passed: data?.data?.passed,
        passPercentage: data?.data?.pass_percentage
      })
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to submit quiz.')
    } finally {
      setIsSubmitting(false)
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

        {isLoadingQuiz ? (
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
                height: '520px',
                borderRadius: '28px',
                background: 'rgba(255,255,255,0.75)',
                border: '1px solid rgba(8,26,44,0.06)'
              }}
            />
          </div>
        ) : errorMessage && !quiz ? (
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
        ) : quiz ? (
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
                  Section Quiz
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
                  {quiz.title}
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
                  Pass score: {quiz.pass_percentage}% • {quiz.questions.length} questions
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
                  gap: '18px'
                }}
              >
                {quiz.questions.map((question, index) => (
                  <div
                    key={question.id}
                    style={{
                      padding: '22px',
                      borderRadius: '24px',
                      background: '#ffffff',
                      border: '1px solid rgba(8,26,44,0.08)',
                      display: 'grid',
                      gap: '14px'
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: '12px',
                          letterSpacing: '0.14em',
                          textTransform: 'uppercase',
                          color: '#9b8660',
                          fontWeight: 800,
                          marginBottom: '8px'
                        }}
                      >
                        Question {index + 1}
                      </div>
                      <div
                        style={{
                          color: premiumBlue,
                          fontWeight: 800,
                          fontSize: '20px',
                          lineHeight: 1.5
                        }}
                      >
                        {question.question_text}
                      </div>
                    </div>

                    <div style={{ display: 'grid', gap: '12px' }}>
                      {question.options.map((option) => {
                        const isSelected = answers[question.id] === option.id

                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => handleSelectAnswer(question.id, option.id)}
                            style={{
                              textAlign: 'left',
                              padding: '16px 18px',
                              borderRadius: '18px',
                              border: isSelected
                                ? '1px solid rgba(214,173,98,0.55)'
                                : '1px solid rgba(8,26,44,0.10)',
                              background: isSelected
                                ? 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, #fff6e8 100%)'
                                : '#ffffff',
                              color: premiumBlue,
                              fontWeight: 600,
                              cursor: 'pointer',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            {option.option_text}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
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
                  Quiz Summary
                </div>

                <div style={{ color: premiumBlue, fontSize: '24px', fontWeight: 800, lineHeight: 1.2 }}>
                  Ready to submit?
                </div>

                <div style={{ color: '#6b7280', lineHeight: 1.8, fontSize: '14px' }}>
                  Answer all questions, then submit your quiz. You can retry if you do not pass.
                </div>

                {errorMessage && (
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

                {submitResult && (
                  <div
                    style={{
                      padding: '16px',
                      borderRadius: '18px',
                      border: submitResult.passed
                        ? '1px solid rgba(34, 197, 94, 0.18)'
                        : '1px solid rgba(245, 158, 11, 0.18)',
                      background: submitResult.passed
                        ? 'rgba(34, 197, 94, 0.06)'
                        : 'rgba(245, 158, 11, 0.08)',
                      color: submitResult.passed ? '#166534' : '#92400e',
                      lineHeight: 1.7
                    }}
                  >
                    <div style={{ fontWeight: 800, marginBottom: '6px' }}>{submitResult.message}</div>
                    {typeof submitResult.score === 'number' && (
                      <div>
                        Score: {submitResult.score}%
                        {typeof submitResult.passPercentage === 'number'
                          ? ` • Pass mark: ${submitResult.passPercentage}%`
                          : ''}
                      </div>
                    )}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleSubmitQuiz}
                  disabled={isSubmitting}
                  style={{
                    height: '54px',
                    borderRadius: '999px',
                    border: 'none',
                    background: premiumBlue,
                    color: '#ffffff',
                    fontWeight: 800,
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    opacity: isSubmitting ? 0.65 : 1
                  }}
                >
                  {isSubmitting ? 'Submitting Quiz...' : 'Submit Quiz'}
                </button>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}

export default QuizPage