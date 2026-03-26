import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const premiumBlue = '#081A2C'

const CoursePage = () => {
  const navigate = useNavigate()
  const [isMobile, setIsMobile] = useState(false)
  const [currentUser, setCurrentUser] = useState<{
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

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at top, rgba(217,181,109,0.16), transparent 22%), linear-gradient(180deg, #f8f3ea 0%, #f3ede4 52%, #efe7dc 100%)',
        color: '#101828'
      }}
    >
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          backdropFilter: 'blur(18px)',
          background: 'rgba(8, 26, 44, 0.86)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 12px 30px rgba(8,26,44,0.12)'
        }}
      >
        <div
          style={{
            width: 'min(1240px, calc(100% - 32px))',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '18px 0'
          }}
        >
          <button
            type="button"
            onClick={() => navigate('/')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              background: 'transparent',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '16px',
                background: 'linear-gradient(145deg, #f7e7c2 0%, #d6ad62 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: premiumBlue,
                fontWeight: 800,
                fontSize: '16px',
                boxShadow: '0 14px 28px rgba(0,0,0,0.22)'
              }}
            >
              II
            </div>
            <div>
              <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '17px' }}>
                International Institute
              </div>
              <div
                style={{
                  color: 'rgba(255,255,255,0.66)',
                  fontSize: '11px',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase'
                }}
              >
                Excellence in Accreditation
              </div>
            </div>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {currentUser ? (
              <>
                <div
                  style={{
                    padding: '12px 18px',
                    borderRadius: '999px',
                    background: 'rgba(255,255,255,0.12)',
                    color: '#ffffff',
                    border: '1px solid rgba(255,255,255,0.14)',
                    fontWeight: 700,
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)'
                  }}
                >
                  {currentUser.name || currentUser.username || currentUser.email}
                </div>

                <button
                  type="button"
                  onClick={() => navigate('/course')}
                  style={{
                    padding: '12px 18px',
                    borderRadius: '999px',
                    background: 'rgba(255,255,255,0.08)',
                    color: '#ffffff',
                    border: '1px solid rgba(255,255,255,0.18)',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Courses
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  aria-label="Logout"
                  title="Logout"
                  style={{
                    width: '46px',
                    height: '46px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(255,255,255,0.08)',
                    color: '#ffffff',
                    border: '1px solid rgba(255,255,255,0.18)',
                    borderRadius: '999px',
                    cursor: 'pointer'
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                </button>
              </>
            ) : (
              <>
                {!isMobile && (
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    style={{
                      padding: '11px 18px',
                      background: 'transparent',
                      color: '#ffffff',
                      border: '1px solid rgba(255,255,255,0.18)',
                      borderRadius: '999px',
                      cursor: 'pointer',
                      fontWeight: 600
                    }}
                  >
                    Sign In
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => navigate('/signup')}
                  style={{
                    padding: '12px 24px',
                    background: 'linear-gradient(135deg, #fff8ea 0%, #f1ddb7 100%)',
                    color: premiumBlue,
                    border: 'none',
                    borderRadius: '999px',
                    cursor: 'pointer',
                    fontWeight: 700,
                    boxShadow: '0 12px 26px rgba(0,0,0,0.16)'
                  }}
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div
        style={{
          minHeight: 'calc(100vh - 82px)',
          width: 'min(1240px, calc(100% - 32px))',
          margin: '0 auto',
          padding: '40px 0 56px'
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '28px'
          }}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.92) 0%, #fff9ef 100%)',
              borderRadius: '30px',
              padding: '32px',
              boxShadow: '0 20px 45px rgba(15, 23, 42, 0.08)',
              border: '1px solid rgba(8,26,44,0.06)'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: isMobile ? 'flex-start' : 'center',
                flexDirection: isMobile ? 'column' : 'row',
                gap: '20px',
                marginBottom: '26px'
              }}
            >
              <div>
                <p
                  style={{
                    margin: '0 0 10px',
                    fontSize: '12px',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: '#9b8660',
                    fontWeight: 800
                  }}
                >
                  Course Catalogue
                </p>
                <h1
                  style={{
                    margin: 0,
                    fontSize: isMobile ? '32px' : '44px',
                    lineHeight: 1.05,
                    color: premiumBlue,
                    letterSpacing: '-0.03em'
                  }}
                >
                  Discover Premium Learning Paths
                </h1>
                <p
                  style={{
                    margin: '14px 0 0',
                    color: '#5b5b5b',
                    lineHeight: 1.8,
                    maxWidth: '760px'
                  }}
                >
                  Browse your upcoming institute courses, track categories, and preview featured programs.
                  This is a temporary showcase layout until the real data is connected from the backend.
                </p>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(2, minmax(120px, 1fr))',
                  gap: '14px',
                  minWidth: isMobile ? '100%' : '290px',
                  width: isMobile ? '100%' : 'auto'
                }}
              >
                {[
                  ['24+', 'Active Courses'],
                  ['6', 'Categories'],
                  ['92%', 'Completion'],
                  ['New', 'Live Updates']
                ].map(([value, label]) => (
                  <div
                    key={label}
                    style={{
                      padding: '16px',
                      borderRadius: '22px',
                      background: 'linear-gradient(180deg, #f6efe1 0%, #f1e7d7 100%)',
                      border: '1px solid rgba(8,26,44,0.06)'
                    }}
                  >
                    <div style={{ fontSize: '24px', fontWeight: 800, color: premiumBlue }}>{value}</div>
                    <div style={{ fontSize: '13px', color: '#6e675f', marginTop: '6px' }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '1.2fr auto auto',
                gap: '16px',
                alignItems: 'center'
              }}
            >
              <div
                style={{
                  position: 'relative',
                  width: '100%'
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    left: '18px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#8a8177',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Search courses, categories, or instructors"
                  style={{
                    width: '100%',
                    height: '56px',
                    borderRadius: '999px',
                    border: '1px solid rgba(8,26,44,0.08)',
                    background: '#ffffff',
                    padding: '0 20px 0 50px',
                    outline: 'none',
                    fontSize: '15px',
                    color: premiumBlue,
                    boxShadow: '0 8px 22px rgba(15, 23, 42, 0.04)'
                  }}
                />
              </div>

              <button
                type="button"
                style={{
                  height: '56px',
                  padding: '0 20px',
                  borderRadius: '999px',
                  border: '1px solid rgba(8,26,44,0.1)',
                  background: '#ffffff',
                  color: premiumBlue,
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Filter
              </button>

              <div
                style={{
                  height: '56px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '0 12px',
                  borderRadius: '999px',
                  background: '#ffffff',
                  border: '1px solid rgba(8,26,44,0.08)',
                  boxShadow: '0 8px 22px rgba(15, 23, 42, 0.04)'
                }}
              >
                <button
                  type="button"
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '999px',
                    border: 'none',
                    background: premiumBlue,
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                  aria-label="Grid view"
                  title="Grid view"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="3" width="7" height="7" rx="1.5" />
                    <rect x="14" y="3" width="7" height="7" rx="1.5" />
                    <rect x="14" y="14" width="7" height="7" rx="1.5" />
                    <rect x="3" y="14" width="7" height="7" rx="1.5" />
                  </svg>
                </button>
                <button
                  type="button"
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '999px',
                    border: 'none',
                    background: 'transparent',
                    color: '#8a8177',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                  aria-label="List view"
                  title="List view"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="8" y1="6" x2="21" y2="6" />
                    <line x1="8" y1="12" x2="21" y2="12" />
                    <line x1="8" y1="18" x2="21" y2="18" />
                    <line x1="3" y1="6" x2="3.01" y2="6" />
                    <line x1="3" y1="12" x2="3.01" y2="12" />
                    <line x1="3" y1="18" x2="3.01" y2="18" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, minmax(0, 1fr))',
              gap: '22px'
            }}
          >
            {[
              {
                category: 'Business Strategy',
                title: 'Executive Leadership Essentials',
                text: 'A premium leadership track focused on strategy, communication, and institutional growth.',
                tag: 'Featured',
                price: '$249',
              },
              {
                category: 'Education Standards',
                title: 'Accreditation Readiness Program',
                text: 'Prepare institutions for evaluation with modern frameworks, policy alignment, and evidence mapping.',
                tag: 'Popular',
                price: '$319',
              },
              {
                category: 'Professional Growth',
                title: 'Global Fellowship Preparation',
                text: 'A guided path for professionals seeking international recognition and fellowship opportunities.',
                tag: 'New',
                price: '$199',
              },
              {
                category: 'Training Centers',
                title: 'Certified Trainer Development',
                text: 'Strengthen delivery excellence, curriculum planning, and learner engagement methods.',
                tag: 'Updated',
                price: '$279',
              },
              {
                category: 'Digital Learning',
                title: 'Modern LMS & Course Delivery',
                text: 'Build a scalable digital learning experience with blended learning and learner analytics.',
                tag: 'Live',
                price: '$229',
              },
              {
                category: 'Membership',
                title: 'Professional Membership Onboarding',
                text: 'Understand the structure, benefits, and standards behind international professional membership.',
                tag: 'Recommended',
                price: '$149',
              }
            ].map((course) => (
              <div
                key={course.title}
                style={{
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.94) 0%, #fff8ef 100%)',
                  padding: '24px',
                  border: '1px solid rgba(8,26,44,0.06)',
                  boxShadow: '0 18px 40px rgba(15, 23, 42, 0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '18px'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                >
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '8px 12px',
                      borderRadius: '999px',
                      background: 'rgba(217,181,109,0.16)',
                      color: '#9a7a37',
                      fontSize: '12px',
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase'
                    }}
                  >
                    {course.category}
                  </span>
                  <span
                    style={{
                      color: premiumBlue,
                      fontSize: '12px',
                      fontWeight: 700
                    }}
                  >
                    {course.tag}
                  </span>
                </div>

                <div
                  style={{
                    height: '160px',
                    background:
                      'linear-gradient(135deg, rgba(8,26,44,0.96) 0%, rgba(13,39,66,0.92) 55%, rgba(217,181,109,0.75) 140%)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background:
                        'radial-gradient(circle at top right, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 36%)'
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      left: '20px',
                      bottom: '20px',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: '22px',
                      maxWidth: '80%',
                      lineHeight: 1.15,
                      letterSpacing: '-0.02em'
                    }}
                  >
                    {course.title}
                  </div>
                </div>

                <p
                  style={{
                    margin: 0,
                    color: '#5f5a54',
                    lineHeight: 1.75,
                    fontSize: '14px'
                  }}
                >
                  {course.text}
                </p>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                >
                  <div>
                    <div style={{ color: '#8a8177', fontSize: '12px', marginBottom: '4px' }}>Starting from</div>
                    <div style={{ color: premiumBlue, fontSize: '22px', fontWeight: 800 }}>
                      {course.price}
                    </div>
                  </div>
                  <button
                    type="button"
                    style={{
                      padding: '12px 18px',
                      borderRadius: '999px',
                      border: 'none',
                      background: premiumBlue,
                      color: '#ffffff',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Preview
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CoursePage
