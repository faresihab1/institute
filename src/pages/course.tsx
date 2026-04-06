import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from './components/header'
import logo from '../assets/logo.png'
import { BASE_URL } from '../services/api'

const premiumBlue = '#081A2C'

type Lesson = {
  id: number
  title: string
  type: string
  video_duration_minutes: number | null
  sort_order: number
}

type Section = {
  id: number
  title: string
  description: string
  sort_order: number
  lessons_count?: number
  has_quiz?: boolean
  lessons?: Lesson[]
}

type Program = {
  id: number
  slug: string
  title: string
  short_description: string
  overview?: string
  sections_count?: number
  featured_image: string | null
}

const CourseLearningPage = () => {
  const navigate = useNavigate()
  const { slug } = useParams()
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
  const [program, setProgram] = useState<Program | null>(null)
  const [sections, setSections] = useState<Section[]>([])
  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(null)
  const [sectionDetails, setSectionDetails] = useState<Record<number, Section>>({})
  const [isLoadingProgram, setIsLoadingProgram] = useState(true)
  const [isLoadingSections, setIsLoadingSections] = useState(true)
  const [isLoadingSectionDetails, setIsLoadingSectionDetails] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

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

    if (!slug) {
      setErrorMessage('Course not found.')
      setIsLoadingProgram(false)
      setIsLoadingSections(false)
      return
    }

    if (!token) {
      navigate('/login')
      return
    }

    const controller = new AbortController()

    const fetchCourseData = async () => {
      setErrorMessage('')
      setIsLoadingProgram(true)
      setIsLoadingSections(true)

      try {
        const language = (navigator.language || 'en').slice(0, 2)
        const locale = ['en', 'ar', 'nl'].includes(language) ? language : 'en'

        const [programResponse, sectionsResponse] = await Promise.all([
          fetch(`${BASE_URL}/api/programs/${slug}`, {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Accept-Language': locale,
              Authorization: `Bearer ${token}`
            },
            signal: controller.signal
          }),
          fetch(`${BASE_URL}/api/programs/${slug}/sections`, {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Accept-Language': locale,
              Authorization: `Bearer ${token}`
            },
            signal: controller.signal
          })
        ])

        const programData = await programResponse.json()
        const sectionsData = await sectionsResponse.json()

        if (!programResponse.ok) {
          throw new Error(programData?.message || 'Failed to load course.')
        }

        if (!sectionsResponse.ok) {
          throw new Error(sectionsData?.message || 'Failed to load course sections.')
        }

        const fetchedSections = Array.isArray(sectionsData?.data) ? sectionsData.data : []

        setProgram(programData?.data || null)
        setSections(fetchedSections)
        setSelectedSectionId(fetchedSections[0]?.id ?? null)
      } catch (error) {
        if ((error as Error).name === 'AbortError') return
        setErrorMessage(error instanceof Error ? error.message : 'Failed to load course.')
        setProgram(null)
        setSections([])
      } finally {
        setIsLoadingProgram(false)
        setIsLoadingSections(false)
      }
    }

    fetchCourseData()

    return () => {
      controller.abort()
    }
  }, [navigate, slug])

  useEffect(() => {
    const token = localStorage.getItem('access_token')

    if (!slug || !selectedSectionId || !token || sectionDetails[selectedSectionId]) {
      return
    }

    const controller = new AbortController()

    const fetchSectionDetails = async () => {
      setIsLoadingSectionDetails(true)

      try {
        const language = (navigator.language || 'en').slice(0, 2)
        const locale = ['en', 'ar', 'nl'].includes(language) ? language : 'en'

        const response = await fetch(`${BASE_URL}/api/programs/${slug}/sections/${selectedSectionId}`, {
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
          throw new Error(data?.message || 'Failed to load section details.')
        }

        setSectionDetails((prev) => ({
          ...prev,
          [selectedSectionId]: data?.data
        }))
      } catch (error) {
        if ((error as Error).name === 'AbortError') return
        setErrorMessage(error instanceof Error ? error.message : 'Failed to load section details.')
      } finally {
        setIsLoadingSectionDetails(false)
      }
    }

    fetchSectionDetails()

    return () => {
      controller.abort()
    }
  }, [sectionDetails, selectedSectionId, slug])

  const activeSection = useMemo(() => {
    if (!selectedSectionId) return null
    return sectionDetails[selectedSectionId] || sections.find((section) => section.id === selectedSectionId) || null
  }, [sectionDetails, sections, selectedSectionId])

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
          onClick={() => navigate(`/course/${slug}`)}
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
          ← Back to Course Details
        </button>

        {isLoadingProgram || isLoadingSections ? (
          <div
            style={{
              display: 'grid',
              gap: '20px'
            }}
          >
            <div
              style={{
                height: '220px',
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
        ) : errorMessage ? (
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
        ) : (
          <>
            <div
              style={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '30px',
                minHeight: isMobile ? '260px' : '300px',
                background: program?.featured_image
                  ? `linear-gradient(rgba(8,26,44,0.45), rgba(8,26,44,0.65)), url(${program.featured_image}) center / cover no-repeat`
                  : 'linear-gradient(135deg, rgba(8,26,44,0.96) 0%, rgba(13,39,66,0.92) 55%, rgba(217,181,109,0.75) 140%)',
                boxShadow: '0 24px 55px rgba(15, 23, 42, 0.10)'
              }}
            >
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
                  Enrolled Course
                </div>

                <h1
                  style={{
                    margin: 0,
                    color: '#ffffff',
                    fontSize: isMobile ? '34px' : '52px',
                    lineHeight: 1,
                    letterSpacing: '-0.04em',
                    maxWidth: '760px'
                  }}
                >
                  {program?.title}
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
                  {program?.short_description}
                </p>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '340px minmax(0, 1fr)',
                gap: '24px',
                alignItems: 'start'
              }}
            >
              <div
                style={{
                  background: '#ffffff',
                  borderRadius: '28px',
                  padding: '22px',
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
                    fontWeight: 800
                  }}
                >
                  Course Parts
                </div>

                {sections.length === 0 ? (
                  <div style={{ color: '#6b7280', lineHeight: 1.7 }}>No sections available yet.</div>
                ) : (
                  sections.map((section, index) => {
                    const isActive = section.id === selectedSectionId

                    return (
                      <button
                        key={section.id}
                        type="button"
                        onClick={() => setSelectedSectionId(section.id)}
                        style={{
                          textAlign: 'left',
                          padding: '18px',
                          borderRadius: '20px',
                          border: isActive ? '1px solid rgba(214,173,98,0.45)' : '1px solid rgba(8,26,44,0.08)',
                          background: isActive ? 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, #fff6e8 100%)' : '#ffffff',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div
                          style={{
                            fontSize: '12px',
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                            color: '#9b8660',
                            fontWeight: 800,
                            marginBottom: '8px'
                          }}
                        >
                          Part {index + 1}
                        </div>
                        <div style={{ color: premiumBlue, fontSize: '18px', fontWeight: 800, lineHeight: 1.35 }}>
                          {section.title}
                        </div>
                        <div style={{ color: '#6b7280', fontSize: '14px', marginTop: '8px', lineHeight: 1.65 }}>
                          {section.lessons_count ?? 0} lessons {section.has_quiz ? '• Quiz included' : ''}
                        </div>
                      </button>
                    )
                  })
                )}
              </div>

              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, #fff9ef 100%)',
                  borderRadius: '28px',
                  padding: isMobile ? '24px 20px' : '30px',
                  boxShadow: '0 18px 40px rgba(15, 23, 42, 0.08)',
                  border: '1px solid rgba(8,26,44,0.06)',
                  display: 'grid',
                  gap: '20px'
                }}
              >
                {activeSection ? (
                  <>
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
                        Current Part
                      </div>
                      <h2
                        style={{
                          margin: 0,
                          color: premiumBlue,
                          fontSize: isMobile ? '28px' : '38px',
                          fontWeight: 800,
                          letterSpacing: '-0.03em'
                        }}
                      >
                        {activeSection.title}
                      </h2>
                      <p
                        style={{
                          margin: '14px 0 0',
                          color: '#555',
                          lineHeight: 1.9,
                          fontSize: '15px'
                        }}
                      >
                        {activeSection.description || 'Section details will be available soon.'}
                      </p>
                    </div>

                    <div
                      style={{
                        display: 'grid',
                        gap: '14px'
                      }}
                    >
                      <div
                        style={{
                          color: premiumBlue,
                          fontSize: '22px',
                          fontWeight: 800,
                          letterSpacing: '-0.02em'
                        }}
                      >
                        Lessons
                      </div>

                      {isLoadingSectionDetails && !sectionDetails[selectedSectionId || 0] ? (
                        <div style={{ color: '#6b7280', lineHeight: 1.7 }}>Loading lessons...</div>
                      ) : activeSection.lessons && activeSection.lessons.length > 0 ? (
                        activeSection.lessons.map((lesson, index) => (
                          <div
                            key={lesson.id}
                            style={{
                              padding: '18px',
                              borderRadius: '20px',
                              background: '#ffffff',
                              border: '1px solid rgba(8,26,44,0.08)',
                              display: 'flex',
                              justifyContent: 'space-between',
                              gap: '14px',
                              flexWrap: 'wrap'
                            }}
                          >
                            <div>
                              <div
                                style={{
                                  fontSize: '12px',
                                  letterSpacing: '0.12em',
                                  textTransform: 'uppercase',
                                  color: '#9b8660',
                                  fontWeight: 800,
                                  marginBottom: '6px'
                                }}
                              >
                                Lesson {index + 1}
                              </div>
                              <div style={{ color: premiumBlue, fontWeight: 800, fontSize: '18px', lineHeight: 1.4 }}>
                                {lesson.title}
                              </div>
                              <div style={{ color: '#6b7280', marginTop: '8px', fontSize: '14px' }}>
                                {lesson.type}
                                {lesson.video_duration_minutes ? ` • ${lesson.video_duration_minutes} min` : ''}
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => navigate(`/lesson/${lesson.id}?slug=${slug}&section=${activeSection.id}`)}
                              style={{
                                alignSelf: 'center',
                                padding: '12px 18px',
                                borderRadius: '999px',
                                border: 'none',
                                background: premiumBlue,
                                color: '#ffffff',
                                fontWeight: 700,
                                cursor: 'pointer'
                              }}
                            >
                              Open Lesson
                            </button>
                          </div>
                        ))
                      ) : (
                        <div style={{ color: '#6b7280', lineHeight: 1.7 }}>No lessons available for this part yet.</div>
                      )}
                    </div>

                    {activeSection.has_quiz && (
                      <div
                        style={{
                          padding: '20px',
                          borderRadius: '22px',
                          background: 'linear-gradient(180deg, #10263D 0%, #0b1e31 100%)',
                          color: '#ffffff',
                          boxShadow: '0 18px 38px rgba(8,26,44,0.16)',
                          display: 'grid',
                          gap: '14px'
                        }}
                      >
                        <div
                          style={{
                            fontSize: '12px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.18em',
                            color: '#d6ad62',
                            fontWeight: 800
                          }}
                        >
                          Section Quiz
                        </div>
                        <div style={{ fontSize: '24px', fontWeight: 800, lineHeight: 1.2 }}>
                          Complete the lessons, then take the quiz.
                        </div>
                        <button
                          type="button"
                          onClick={() => navigate(`/quiz/${activeSection.id}?slug=${slug}`)}
                          style={{
                            width: 'fit-content',
                            padding: '12px 18px',
                            borderRadius: '999px',
                            border: 'none',
                            background: '#ffffff',
                            color: premiumBlue,
                            fontWeight: 800,
                            cursor: 'pointer'
                          }}
                        >
                          Open Quiz
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div style={{ color: '#6b7280', lineHeight: 1.7 }}>Select a course part to start learning.</div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default CourseLearningPage