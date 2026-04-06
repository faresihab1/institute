

import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from './components/header'
import logo from '../assets/logo.png'
import { BASE_URL } from '../services/api'

const premiumBlue = '#081A2C'

type ProgramCategory = {
  id: number
  name: string
  slug: string
  description: string | null
  is_active: boolean
  created_at?: string
  updated_at?: string
}

type Program = {
  id: number
  program_category_id: number
  slug: string
  title: string
  short_description: string
  overview?: string
  outcomes?: string
  target_audience?: string
  entry_requirements?: string
  duration: string
  delivery_mode: string
  assessment_method: string
  fees: string
  currency: string
  featured_image: string | null
  intro_video_url?: string | null
  intro_text?: string | null
  price_points?: number
  sections_count?: number
  is_featured: boolean
  is_active: boolean
  category?: ProgramCategory
}

const CourseDetailsPage = () => {
  const navigate = useNavigate()
  const { slug } = useParams()
  const [isMobile, setIsMobile] = useState(false)
  const [program, setProgram] = useState<Program | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [purchaseMessage, setPurchaseMessage] = useState('')
  const [isPurchased, setIsPurchased] = useState(false)
  const [purchaseError, setPurchaseError] = useState('')
  const [isPurchasing, setIsPurchasing] = useState(false)
  const [walletBalance, setWalletBalance] = useState<number | null>(null)
  const [isLoadingWallet, setIsLoadingWallet] = useState(false)
  const [isCheckingEnrollment, setIsCheckingEnrollment] = useState(false)
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

  useEffect(() => {
    const token = localStorage.getItem('access_token')

    if (!token || !currentUser || !slug) {
      setIsPurchased(false)
      return
    }

    const controller = new AbortController()

    const checkEnrollment = async () => {
      setIsCheckingEnrollment(true)

      try {
        const response = await fetch(`${BASE_URL}/api/my/enrollments/${slug}`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
          },
          signal: controller.signal
        })

        const data = await response.json()

        if (response.ok && data?.data) {
          setIsPurchased(true)
          setPurchaseError('')
          return
        }

        setIsPurchased(false)
      } catch (error) {
        if ((error as Error).name === 'AbortError') return
        setIsPurchased(false)
      } finally {
        setIsCheckingEnrollment(false)
      }
    }

    checkEnrollment()

    return () => {
      controller.abort()
    }
  }, [currentUser, slug])

  useEffect(() => {
    const token = localStorage.getItem('access_token')

    if (!token || !currentUser) {
      setWalletBalance(null)
      return
    }

    const controller = new AbortController()

    const fetchWallet = async () => {
      setIsLoadingWallet(true)

      try {
        const response = await fetch(`${BASE_URL}/api/wallet`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
          },
          signal: controller.signal
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data?.message || 'Failed to load wallet balance.')
        }

        setWalletBalance(
          typeof data?.data?.balance === 'number'
            ? data.data.balance
            : Number(data?.data?.balance ?? 0)
        )
      } catch (error) {
        if ((error as Error).name === 'AbortError') return
        setWalletBalance(null)
      } finally {
        setIsLoadingWallet(false)
      }
    }

    fetchWallet()

    return () => {
      controller.abort()
    }
  }, [currentUser])

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
    if (!slug) {
      setErrorMessage('Course not found.')
      setIsLoading(false)
      return
    }

    const controller = new AbortController()

    const fetchProgram = async () => {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const language = (navigator.language || 'en').slice(0, 2)
        const locale = ['en', 'ar', 'nl'].includes(language) ? language : 'en'

        const response = await fetch(`${BASE_URL}/api/programs/${slug}`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Accept-Language': locale
          },
          signal: controller.signal
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data?.message || 'Failed to load course details.')
        }

        setProgram(data?.data || null)
      } catch (error) {
        if ((error as Error).name === 'AbortError') return
        setErrorMessage(error instanceof Error ? error.message : 'Failed to load course details.')
        setProgram(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProgram()

    return () => {
      controller.abort()
    }
  }, [slug])

  const infoItems = useMemo(() => {
    if (!program) return []

    return [
      ['Category', program.category?.name || 'Program'],
      ['Duration', program.duration || 'Not specified'],
      ['Delivery', program.delivery_mode || 'Not specified'],
      ['Assessment', program.assessment_method || 'Not specified'],
      ['Price', `${program.currency} ${program.fees}`],
      ['II Points', program.price_points ? `${program.price_points} Points` : 'Not specified'],
      ['Your Wallet', isLoadingWallet ? 'Loading...' : walletBalance !== null ? `${walletBalance} Points` : 'Sign in to view']
    ]
  }, [program, isLoadingWallet, walletBalance])

  const programPricePoints = typeof program?.price_points === 'number' ? program.price_points : 0
  const hasEnoughPoints = walletBalance !== null ? walletBalance >= programPricePoints : false

  const handlePurchase = async () => {
    const token = localStorage.getItem('access_token')

    setPurchaseMessage('')
    setPurchaseError('')

    if (!currentUser || !token) {
      setPurchaseError('Please sign in first to purchase this course.')
      return
    }

    if (!program?.slug) {
      setPurchaseError('Course details are missing.')
      return
    }

    setIsPurchasing(true)

    try {
      const response = await fetch(`${BASE_URL}/api/programs/${program.slug}/purchase`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error || data?.message || 'Failed to purchase this course.')
      }

      setPurchaseMessage(data?.message || 'Program purchased successfully.')
      setIsPurchased(true)

      if (walletBalance !== null) {
        setWalletBalance(Math.max(0, walletBalance - programPricePoints))
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to purchase this course.'

      if (message.toLowerCase().includes('already enrolled')) {
        setIsPurchased(true)
        setPurchaseError('')
        setPurchaseMessage('You are already enrolled in this program.')
      } else {
        setPurchaseError(message)
      }
    } finally {
      setIsPurchasing(false)
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
          padding: isMobile ? '28px 0 48px' : '40px 0 56px'
        }}
      >
        <button
          type="button"
          onClick={() => navigate('/course')}
          style={{
            marginBottom: '18px',
            padding: '10px 16px',
            borderRadius: '999px',
            border: '1px solid rgba(8,26,44,0.10)',
            background: '#ffffff',
            color: premiumBlue,
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          ← Back to Courses
        </button>

        {isLoading ? (
          <div
            style={{
              display: 'grid',
              gap: '24px'
            }}
          >
            <div
              style={{
                height: '360px',
                borderRadius: '28px',
                background: 'linear-gradient(135deg, rgba(8,26,44,0.10) 0%, rgba(13,39,66,0.12) 55%, rgba(217,181,109,0.20) 140%)'
              }}
            />
            <div
              style={{
                height: '280px',
                borderRadius: '28px',
                background: 'rgba(255,255,255,0.7)',
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
        ) : !program ? (
          <div
            style={{
              padding: '24px',
              borderRadius: '22px',
              border: '1px solid rgba(8,26,44,0.08)',
              background: 'rgba(255,255,255,0.7)',
              color: '#4b5563'
            }}
          >
            Course details are not available.
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '26px' }}>
            <div
              style={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '30px',
                minHeight: isMobile ? '320px' : '420px',
                background: program.featured_image
                  ? `linear-gradient(rgba(8,26,44,0.35), rgba(8,26,44,0.60)), url(${program.featured_image}) center / cover no-repeat`
                  : 'linear-gradient(135deg, rgba(8,26,44,0.96) 0%, rgba(13,39,66,0.92) 55%, rgba(217,181,109,0.75) 140%)',
                boxShadow: '0 24px 55px rgba(15, 23, 42, 0.10)'
              }}
            >
              {!program.featured_image && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'radial-gradient(circle at top right, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0) 34%)'
                  }}
                />
              )}

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
                  {program.category?.name || 'Program'}
                </div>

                <h1
                  style={{
                    margin: 0,
                    color: '#ffffff',
                    fontSize: isMobile ? '34px' : '56px',
                    lineHeight: 1,
                    letterSpacing: '-0.04em',
                    maxWidth: '760px'
                  }}
                >
                  {program.title}
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
                  {program.short_description}
                </p>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '1.1fr 0.9fr',
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
                <div>
                  <h2
                    style={{
                      margin: 0,
                      color: premiumBlue,
                      fontSize: isMobile ? '28px' : '36px',
                      fontWeight: 800,
                      letterSpacing: '-0.03em'
                    }}
                  >
                    Overview
                  </h2>
                  <p
                    style={{
                      margin: '14px 0 0',
                      color: '#555',
                      lineHeight: 1.9,
                      fontSize: '15px'
                    }}
                  >
                    {program.overview || 'Overview will be available soon.'}
                  </p>
                </div>

                <div>
                  <h3
                    style={{
                      margin: 0,
                      color: premiumBlue,
                      fontSize: '24px',
                      fontWeight: 800,
                      letterSpacing: '-0.02em'
                    }}
                  >
                    Learning Outcomes
                  </h3>
                  <p
                    style={{
                      margin: '12px 0 0',
                      color: '#555',
                      lineHeight: 1.9,
                      fontSize: '15px'
                    }}
                  >
                    {program.outcomes || 'Learning outcomes will be available soon.'}
                  </p>
                </div>

                {(program.target_audience || program.entry_requirements) && (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                      gap: '16px'
                    }}
                  >
                    <div
                      style={{
                        padding: '18px',
                        borderRadius: '20px',
                        background: '#ffffff',
                        border: '1px solid rgba(8,26,44,0.06)'
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
                        Target Audience
                      </div>
                      <div style={{ color: '#555', lineHeight: 1.75, fontSize: '14px' }}>
                        {program.target_audience || 'Not specified'}
                      </div>
                    </div>

                    <div
                      style={{
                        padding: '18px',
                        borderRadius: '20px',
                        background: '#ffffff',
                        border: '1px solid rgba(8,26,44,0.06)'
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
                        Entry Requirements
                      </div>
                      <div style={{ color: '#555', lineHeight: 1.75, fontSize: '14px' }}>
                        {program.entry_requirements || 'Not specified'}
                      </div>
                    </div>
                  </div>
                )}

                {program.intro_text && (
                  <div>
                    <h3
                      style={{
                        margin: 0,
                        color: premiumBlue,
                        fontSize: '24px',
                        fontWeight: 800,
                        letterSpacing: '-0.02em'
                      }}
                    >
                      Intro Text
                    </h3>
                    <p
                      style={{
                        margin: '12px 0 0',
                        color: '#555',
                        lineHeight: 1.9,
                        fontSize: '15px'
                      }}
                    >
                      {program.intro_text}
                    </p>
                  </div>
                )}
              </div>

              <div
                style={{
                  display: 'grid',
                  gap: '20px'
                }}
              >
                <div
                  style={{
                    background: '#ffffff',
                    borderRadius: '28px',
                    padding: isMobile ? '24px 20px' : '28px',
                    border: '1px solid rgba(8,26,44,0.08)',
                    boxShadow: '0 16px 35px rgba(15, 23, 42, 0.06)'
                  }}
                >
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
                    Course Information
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gap: '12px'
                    }}
                  >
                    {infoItems.map(([label, value]) => (
                      <div
                        key={label}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          gap: '12px',
                          padding: '14px 0',
                          borderBottom: '1px solid rgba(8,26,44,0.06)'
                        }}
                      >
                        <span style={{ color: '#6b7280', fontSize: '14px' }}>{label}</span>
                        <span style={{ color: premiumBlue, fontSize: '14px', fontWeight: 700, textAlign: 'right' }}>
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {purchaseError && (
                    <div
                      style={{
                        marginTop: '18px',
                        padding: '14px 16px',
                        borderRadius: '16px',
                        border: '1px solid rgba(220, 38, 38, 0.18)',
                        background: 'rgba(220, 38, 38, 0.05)',
                        color: '#991b1b',
                        fontSize: '14px',
                        lineHeight: 1.7
                      }}
                    >
                      {purchaseError}
                    </div>
                  )}

                  {purchaseMessage && (
                    <div
                      style={{
                        marginTop: '18px',
                        padding: '14px 16px',
                        borderRadius: '16px',
                        border: '1px solid rgba(34, 197, 94, 0.18)',
                        background: 'rgba(34, 197, 94, 0.06)',
                        color: '#166534',
                        fontSize: '14px',
                        lineHeight: 1.7
                      }}
                    >
                      {purchaseMessage}
                    </div>
                  )}

                  <div
                    style={{
                      display: 'grid',
                      gap: '12px',
                      marginTop: '20px'
                    }}
                  >
                    <button
                      type="button"
                      onClick={isPurchased ? () => navigate(`/learn/${program?.slug}`) : handlePurchase}
                      disabled={
                        isCheckingEnrollment
                          ? true
                          : isPurchased
                            ? false
                            : isPurchasing || !currentUser || (walletBalance !== null && !hasEnoughPoints)
                      }
                      style={{
                        height: '54px',
                        borderRadius: '999px',
                        border: 'none',
                        background: premiumBlue,
                        color: '#ffffff',
                        fontWeight: 800,
                        cursor:
                          isCheckingEnrollment
                            ? 'not-allowed'
                            : isPurchased
                              ? 'pointer'
                              : isPurchasing || !currentUser || (walletBalance !== null && !hasEnoughPoints)
                                ? 'not-allowed'
                                : 'pointer',
                        opacity:
                          isCheckingEnrollment
                            ? 0.65
                            : isPurchased
                              ? 1
                              : isPurchasing || !currentUser || (walletBalance !== null && !hasEnoughPoints)
                                ? 0.65
                                : 1
                      }}
                    >
                      {isCheckingEnrollment
                        ? 'Checking Enrollment...'
                        : isPurchased
                          ? 'Browse Course'
                          : isPurchasing
                            ? 'Processing Purchase...'
                            : !currentUser
                              ? 'Sign In to Buy'
                              : walletBalance !== null && !hasEnoughPoints
                                ? 'Not Enough II Points'
                                : `Buy with ${programPricePoints} II Points`}
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('/course')}
                      style={{
                        height: '54px',
                        borderRadius: '999px',
                        border: '1px solid rgba(8,26,44,0.10)',
                        background: '#ffffff',
                        color: premiumBlue,
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Continue Browsing
                    </button>
                  </div>
                </div>

                <div
                  style={{
                    background: 'linear-gradient(180deg, #10263D 0%, #0b1e31 100%)',
                    borderRadius: '28px',
                    padding: isMobile ? '24px 20px' : '28px',
                    color: '#ffffff',
                    boxShadow: '0 18px 38px rgba(8,26,44,0.16)'
                  }}
                >
                  <div
                    style={{
                      fontSize: '12px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.18em',
                      color: '#d6ad62',
                      fontWeight: 800,
                      marginBottom: '12px'
                    }}
                  >
                    Quick Summary
                  </div>

                  <h3
                    style={{
                      margin: 0,
                      fontSize: isMobile ? '28px' : '34px',
                      lineHeight: 1.1,
                      letterSpacing: '-0.03em'
                    }}
                  >
                    {program.sections_count ?? 0} sections to explore
                  </h3>

                  <p
                    style={{
                      margin: '14px 0 0',
                      color: 'rgba(255,255,255,0.76)',
                      lineHeight: 1.8,
                      fontSize: '15px'
                    }}
                  >
                    This course is designed to guide learners with structured content, practical outcomes, and a focused learning experience.
                  </p>

                  {program.intro_video_url && (
                    <a
                      href={program.intro_video_url}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: 'inline-flex',
                        marginTop: '18px',
                        textDecoration: 'none',
                        color: '#d6ad62',
                        fontWeight: 800
                      }}
                    >
                      Watch intro video →
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CourseDetailsPage