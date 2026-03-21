import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

const heroImages = [
  'https://images.unsplash.com/photo-1503676260728-1c00da094a0b',
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644',
  'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a',
  'https://images.unsplash.com/photo-1580582932707-520aed937b7b'
]

const featureCards = [
  {
    title: 'Explore Programs',
    subtitle: 'Discover globally recognized academic pathways',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80'
  },
  {
    title: 'Professional Membership',
    subtitle: 'Join an international network of experts',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80'
  },
  {
    title: 'Training Center Accreditation',
    subtitle: 'Validate excellence in institutional delivery',
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80'
  },
  {
    title: 'Global Fellowship',
    subtitle: 'Advance impact through international recognition',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80'
  }
]

const trustItems = [
  {
    title: 'Netherlands Registration',
    description: 'Officially registered and institutionally aligned in the Netherlands',
    icon: 'NL'
  },
  {
    title: 'SSL Secured',
    description: 'Protected access with secure encrypted communication',
    icon: 'SSL'
  },
  {
    title: 'Global Members',
    description: 'A growing international network of learners and professionals',
    icon: 'GM'
  },
  {
    title: 'Verified Credentials',
    description: 'Reliable certificate and recognition pathways for institutions',
    icon: 'VC'
  }
]

const sectionWidth = 'min(1180px, calc(100% - 32px))'

const HomePage = () => {
  const navigate = useNavigate()
  const [index, setIndex] = useState(0)
  const [brief, setBrief] = useState<string>('')
  const [aboutUs, setAboutUs] = useState<string>('')
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
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % heroImages.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [briefRes, aboutRes] = await Promise.all([
          fetch('https://international-institute-main-vrqh7a.laravel.cloud/api/pages/homepage-brief'),
          fetch('https://international-institute-main-vrqh7a.laravel.cloud/api/pages/about-us')
        ])

        const briefData = await briefRes.json()
        const aboutData = await aboutRes.json()

        setBrief(briefData.content)
        setAboutUs(aboutData.content)
      } catch (err) {
        console.error('Failed to fetch homepage data:', err)
      }
    }

    fetchContent()
  }, [])

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth'
    document.body.style.scrollBehavior = 'smooth'

    const updateViewport = () => {
      setIsMobile(window.innerWidth < 900)
    }

    updateViewport()
    window.addEventListener('resize', updateViewport)

    return () => {
      document.documentElement.style.scrollBehavior = ''
      document.body.style.scrollBehavior = ''
      window.removeEventListener('resize', updateViewport)
    }
  }, [])

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #f7f2ea 0%, #f2ece3 100%)',
        color: '#101828'
      }}
    >
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          backdropFilter: 'blur(16px)',
          background: 'rgba(8, 26, 44, 0.92)',
          borderBottom: '1px solid rgba(255,255,255,0.08)'
        }}
      >
        <div
          style={{
            width: sectionWidth,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '18px 0'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #d5b06a 0%, #f5e5bf 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#081A2C',
                fontWeight: 800,
                fontSize: '16px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.18)'
              }}
            >
              RI
            </div>
            <div>
              <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '16px' }}>
                International Institute
              </div>
              <div
                style={{
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: '12px',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase'
                }}
              >
                Netherlands B.V.
              </div>
            </div>
          </div>

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
                    fontWeight: 700
                  }}
                >
                  {currentUser.name || currentUser.username || currentUser.email}
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  aria-label="Logout"
                  title="Logout"
                  style={{
                    width: '44px',
                    height: '44px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'transparent',
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
                    padding: '12px 22px',
                    background: 'linear-gradient(135deg, #ffffff 0%, #f3e7cf 100%)',
                    color: '#081A2C',
                    border: 'none',
                    borderRadius: '999px',
                    cursor: 'pointer',
                    fontWeight: 700,
                    boxShadow: '0 10px 25px rgba(0,0,0,0.16)'
                  }}
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div style={{ width: sectionWidth, margin: '0 auto', paddingTop: '28px' }}>
        <section
          style={{
            position: 'relative',
            minHeight: isMobile ? '500px' : '680px',
            borderRadius: '34px',
            overflow: 'hidden',
            boxShadow: '0 26px 60px rgba(13, 25, 45, 0.18)',
            background: '#d9d2c4'
          }}
        >
          <div
            style={{
              display: 'flex',
              width: `${heroImages.length * 100}%`,
              height: '100%',
              transform: `translateX(-${index * (100 / heroImages.length)}%)`,
              transition: 'transform 1.2s ease-in-out'
            }}
          >
            {heroImages.map((image, imageIndex) => (
              <img
                key={imageIndex}
                src={`${image}?auto=format&fit=crop&w=1600&q=80`}
                alt={`hero-slide-${imageIndex + 1}`}
                style={{
                  width: `${100 / heroImages.length}%`,
                  height: '100%',
                  objectFit: 'cover',
                  flexShrink: 0
                }}
              />
            ))}
          </div>

          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(180deg, rgba(8,26,44,0.18) 0%, rgba(8,26,44,0.40) 40%, rgba(8,26,44,0.82) 100%)'
            }}
          />

          <div
            style={{
              position: 'absolute',
              inset: 0,
              padding: isMobile ? '24px' : '38px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 16px',
                  borderRadius: '999px',
                  background: 'rgba(255,255,255,0.12)',
                  color: '#f2e2be',
                  backdropFilter: 'blur(10px)',
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase'
                }}
              >
                Established in the Netherlands
              </div>
            </div>

            <div>
              <h1
                style={{
                  margin: 0,
                  color: '#ffffff',
                  fontSize: isMobile ? '36px' : 'clamp(48px, 6vw, 72px)',
                  lineHeight: 1.02,
                  maxWidth: '860px'
                }}
              >
                Advancing Professional Excellence Through International Accreditation
              </h1>
              <p
                style={{
                  margin: '18px 0 0',
                  color: 'rgba(255,255,255,0.88)',
                  fontSize: isMobile ? '15px' : '18px',
                  lineHeight: 1.8,
                  maxWidth: '760px'
                }}
              >
                The International Institute for Studies Netherlands B.V. is a distinguished international body
                dedicated to professional education, certification, and institutional accreditation.
              </p>
            </div>
          </div>
        </section>
      </div>

      <section style={{ width: sectionWidth, margin: '34px auto 0' }}>
        <div
          style={{
            background: 'linear-gradient(180deg, #ffffff 0%, #fcf8f2 100%)',
            borderRadius: '30px',
            padding: isMobile ? '24px' : '34px',
            boxShadow: '0 22px 50px rgba(16, 24, 40, 0.08)',
            border: '1px solid rgba(8,26,44,0.06)'
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1.1fr 0.9fr',
              gap: '28px',
              alignItems: 'start'
            }}
          >
            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: '13px',
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: '#8a7f70',
                  fontWeight: 700
                }}
              >
                Homepage Brief
              </p>
              <h2
                style={{
                  margin: '14px 0 16px',
                  color: '#081A2C',
                  fontSize: isMobile ? '30px' : '38px',
                  lineHeight: 1.12
                }}
              >
                Welcome to the Institute
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: '16px',
                  lineHeight: 1.9,
                  color: '#5f5a54'
                }}
              >
                {brief || 'Loading...'}
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                gap: '16px'
              }}
            >
              {[
                ['Global Reach', 'Worldwide recognition and academic collaboration'],
                ['Accreditation', 'Institutional trust built on quality standards'],
                ['Memberships', 'Professional pathways with international impact'],
                ['Fellowships', 'Prestige opportunities for dedicated learners']
              ].map(([title, text]) => (
                <div
                  key={title}
                  style={{
                    padding: '18px',
                    borderRadius: '20px',
                    background: '#f5efe6',
                    border: '1px solid rgba(8,26,44,0.06)'
                  }}
                >
                  <div style={{ color: '#081A2C', fontWeight: 700, marginBottom: '8px' }}>
                    {title}
                  </div>
                  <div style={{ color: '#6f675d', fontSize: '14px', lineHeight: 1.6 }}>
                    {text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{ width: sectionWidth, margin: '70px auto 0' }}>
        <div style={{ marginBottom: '26px', textAlign: 'center' }}>
          <p
            style={{
              margin: 0,
              fontSize: '13px',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: '#8a7f70',
              fontWeight: 700
            }}
          >
            Opportunities
          </p>
          <h2
            style={{
              margin: '12px 0 0',
              color: '#081A2C',
              fontSize: isMobile ? '30px' : '40px'
            }}
          >
            Explore Our Signature Pathways
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '24px'
          }}
        >
          {featureCards.map((card) => (
            <div
              key={card.title}
              style={{
                position: 'relative',
                minHeight: '300px',
                borderRadius: '28px',
                overflow: 'hidden',
                cursor: 'pointer',
                boxShadow: '0 18px 44px rgba(0,0,0,0.12)',
                transform: 'translateY(0)',
                transition: 'transform 0.35s ease, box-shadow 0.35s ease'
              }}
              onMouseEnter={(e) => {
                const image = e.currentTarget.querySelector('img') as HTMLImageElement | null
                const title = e.currentTarget.querySelector('h3') as HTMLHeadingElement | null
                const subtitle = e.currentTarget.querySelector('p') as HTMLParagraphElement | null
                e.currentTarget.style.transform = 'translateY(-8px)'
                e.currentTarget.style.boxShadow = '0 24px 48px rgba(0,0,0,0.18)'
                if (image) image.style.transform = 'scale(1.08)'
                if (image) image.style.filter = 'blur(3px) brightness(0.58)'
                if (title) title.style.fontSize = '31px'
                if (subtitle) subtitle.style.opacity = '1'
              }}
              onMouseLeave={(e) => {
                const image = e.currentTarget.querySelector('img') as HTMLImageElement | null
                const title = e.currentTarget.querySelector('h3') as HTMLHeadingElement | null
                const subtitle = e.currentTarget.querySelector('p') as HTMLParagraphElement | null
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 18px 44px rgba(0,0,0,0.12)'
                if (image) image.style.transform = 'scale(1)'
                if (image) image.style.filter = 'blur(1px) brightness(0.72)'
                if (title) title.style.fontSize = '27px'
                if (subtitle) subtitle.style.opacity = '0.85'
              }}
            >
              <img
                src={card.image}
                alt={card.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'blur(1px) brightness(0.72)',
                  transition: 'transform 0.4s ease, filter 0.4s ease'
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(180deg, rgba(8,26,44,0.06) 0%, rgba(8,26,44,0.74) 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '24px'
                }}
              >
                <h3
                  style={{
                    color: '#ffffff',
                    fontSize: '27px',
                    lineHeight: '1.15',
                    margin: 0,
                    transition: 'font-size 0.4s ease'
                  }}
                >
                  {card.title}
                </h3>
                <p
                  style={{
                    margin: '10px 0 0',
                    color: 'rgba(255,255,255,0.92)',
                    fontSize: '14px',
                    lineHeight: 1.6,
                    opacity: 0.85,
                    transition: 'opacity 0.35s ease'
                  }}
                >
                  {card.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ width: sectionWidth, margin: '60px auto 0' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #081A2C 0%, #0d2742 60%, #173657 100%)',
            borderRadius: '28px',
            padding: isMobile ? '24px' : '26px 34px',
            boxShadow: '0 18px 40px rgba(8,26,44,0.16)',
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, minmax(0, 1fr))',
            gap: '18px'
          }}
        >
          {trustItems.map((item) => (
            <div
              key={item.title}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '14px',
                color: '#ffffff'
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '16px',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.14)',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#f3e7cf',
                  fontSize: '12px',
                  fontWeight: 800,
                  letterSpacing: '0.08em'
                }}
              >
                {item.icon}
              </div>
              <div>
                <div style={{ fontWeight: 700, marginBottom: '6px' }}>{item.title}</div>
                <div
                  style={{
                    fontSize: '14px',
                    lineHeight: 1.6,
                    color: 'rgba(255,255,255,0.78)'
                  }}
                >
                  {item.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ width: sectionWidth, margin: '70px auto 90px' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #081A2C 0%, #0d2742 60%, #173657 100%)',
            padding: isMobile ? '28px' : '44px',
            borderRadius: '30px',
            boxShadow: '0 24px 50px rgba(8,26,44,0.18)',
            color: '#ffffff',
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '0.9fr 1.1fr',
            gap: '28px'
          }}
        >
          <div>
            <p
              style={{
                margin: '0 0 10px',
                fontSize: '13px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                opacity: 0.75
              }}
            >
              About Us
            </p>
            <h2
              style={{
                margin: 0,
                fontSize: isMobile ? '32px' : '42px',
                lineHeight: 1.08
              }}
            >
              Who We Are
            </h2>
          </div>

          <p
            style={{
              margin: 0,
              fontSize: '16px',
              lineHeight: '1.95',
              color: 'rgba(255,255,255,0.9)'
            }}
          >
            {aboutUs || 'Loading...'}
          </p>
        </div>
      </section>
    </div>
  )
}

export default HomePage