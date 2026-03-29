import { useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import Header from './components/header'
import logo from '../assets/logo.png'


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

const sectionWidth = 'min(1240px, calc(100% - 32px))'
const premiumBlue = '#081A2C'
const premiumGold = '#D9B56D'

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

  const briefRef = useRef<HTMLElement | null>(null)
  const opportunitiesRef = useRef<HTMLElement | null>(null)
  const trustRef = useRef<HTMLElement | null>(null)
  const aboutRef = useRef<HTMLElement | null>(null)

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

  useEffect(() => {
    const animatedElements = [
      briefRef.current,
      opportunitiesRef.current,
      trustRef.current,
      aboutRef.current
    ].filter(Boolean) as HTMLElement[]

    if (!animatedElements.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.animate(
              [
                { opacity: 0, transform: 'translateY(42px) scale(0.985)' },
                { opacity: 1, transform: 'translateY(0) scale(1)' }
              ],
              {
                duration: 900,
                easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
                fill: 'forwards'
              }
            )
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.16 }
    )

    animatedElements.forEach((element) => {
      element.style.opacity = '0'
      element.style.transform = 'translateY(42px) scale(0.985)'
      observer.observe(element)
    })

    return () => observer.disconnect()
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
      <Header currentUser={currentUser} isMobile={isMobile} onLogout={handleLogout} logoSrc={logo} />

      <div style={{ width: sectionWidth, margin: '0 auto', paddingTop: '30px' }}>
        <section
          style={{
            position: 'relative',
            minHeight: isMobile ? '520px' : '720px',
            borderRadius: '36px',
            overflow: 'hidden',
            boxShadow: '0 28px 70px rgba(13, 25, 45, 0.2)',
            background: '#d9d2c4',
            border: '1px solid rgba(255,255,255,0.55)'
          }}
        >
          <div
            style={{
              display: 'flex',
              width: `${heroImages.length * 100}%`,
              height: '100%',
              transform: `translateX(-${index * (100 / heroImages.length)}%)`,
              transition: 'transform 1.4s cubic-bezier(0.22, 1, 0.36, 1)'
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
                  flexShrink: 0,
                  filter: 'saturate(0.92) contrast(1.03)'
                }}
              />
            ))}
          </div>

          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(180deg, rgba(8,26,44,0.12) 0%, rgba(8,26,44,0.36) 38%, rgba(8,26,44,0.86) 100%)'
            }}
          />

          <div
            style={{
              position: 'absolute',
              inset: 0,
              padding: isMobile ? '24px' : '40px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 16px',
                  borderRadius: '999px',
                  background: 'rgba(255,255,255,0.14)',
                  color: '#f7e4b5',
                  backdropFilter: 'blur(12px)',
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)'
                }}
              >
                Established in the Netherlands
              </div>

              {!isMobile && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                    gap: '12px',
                    minWidth: '420px'
                  }}
                >
                  {[
                    ['150+', 'Partner Institutions'],
                    ['70+', 'Countries Reached'],
                    ['24/7', 'Secure Digital Access']
                  ].map(([value, label]) => (
                    <div
                      key={label}
                      style={{
                        padding: '14px 16px',
                        borderRadius: '20px',
                        background: 'rgba(255,255,255,0.10)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)'
                      }}
                    >
                      <div style={{ color: '#ffffff', fontSize: '21px', fontWeight: 800 }}>{value}</div>
                      <div style={{ color: 'rgba(255,255,255,0.72)', fontSize: '12px', marginTop: '4px' }}>
                        {label}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div
                style={{
                  width: '84px',
                  height: '2px',
                  background: `linear-gradient(90deg, ${premiumGold} 0%, rgba(217,181,109,0) 100%)`,
                  marginBottom: '18px'
                }}
              />
              <h1
                style={{
                  margin: 0,
                  color: '#ffffff',
                  fontSize: isMobile ? '38px' : 'clamp(52px, 6vw, 78px)',
                  lineHeight: 0.98,
                  maxWidth: '920px',
                  letterSpacing: '-0.03em'
                }}
              >
                Advancing Professional Excellence Through International Accreditation
              </h1>
              <p
                style={{
                  margin: '20px 0 0',
                  color: 'rgba(255,255,255,0.88)',
                  fontSize: isMobile ? '15px' : '19px',
                  lineHeight: 1.9,
                  maxWidth: '780px'
                }}
              >
                The International Institute for Studies Netherlands B.V. is a distinguished international body
                dedicated to professional education, certification, and institutional accreditation.
              </p>

              <div style={{ display: 'flex', gap: '14px', marginTop: '28px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => navigate(currentUser ? '/' : '/signup')}
                  style={{
                    padding: '14px 26px',
                    border: 'none',
                    borderRadius: '999px',
                    background: `linear-gradient(135deg, ${premiumGold} 0%, #f0dab0 100%)`,
                    color: premiumBlue,
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 16px 30px rgba(0,0,0,0.18)'
                  }}
                >
                  {currentUser ? 'Explore Opportunities' : 'Get Started'}
                </button>
                <button
                  type="button"
                  onClick={() => aboutRef.current?.scrollIntoView({ behavior: 'smooth' })}
                  style={{
                    padding: '14px 24px',
                    borderRadius: '999px',
                    background: 'rgba(255,255,255,0.08)',
                    color: '#ffffff',
                    border: '1px solid rgba(255,255,255,0.2)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section ref={briefRef} style={{ width: sectionWidth, margin: '36px auto 0' }}>
        <div
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, #fffaf2 100%)',
            borderRadius: '32px',
            padding: isMobile ? '24px' : '38px',
            boxShadow: '0 24px 56px rgba(16, 24, 40, 0.08)',
            border: '1px solid rgba(8,26,44,0.06)'
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1.05fr 0.95fr',
              gap: '30px',
              alignItems: 'start'
            }}
          >
            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: '12px',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: '#95856d',
                  fontWeight: 800
                }}
              >
                Homepage Brief
              </p>
              <h2
                style={{
                  margin: '14px 0 16px',
                  color: premiumBlue,
                  fontSize: isMobile ? '31px' : '42px',
                  lineHeight: 1.08,
                  letterSpacing: '-0.03em'
                }}
              >
                Welcome to the Institute
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: '16px',
                  lineHeight: 1.95,
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
                    padding: '20px',
                    borderRadius: '24px',
                    background: 'linear-gradient(180deg, #f7f0e5 0%, #f3eadb 100%)',
                    border: '1px solid rgba(8,26,44,0.06)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.55)'
                  }}
                >
                  <div style={{ color: premiumBlue, fontWeight: 800, marginBottom: '8px' }}>{title}</div>
                  <div style={{ color: '#6f675d', fontSize: '14px', lineHeight: 1.65 }}>{text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section ref={opportunitiesRef} style={{ width: sectionWidth, margin: '78px auto 0' }}>
        <div style={{ marginBottom: '28px', textAlign: 'center' }}>
          <p
            style={{
              margin: 0,
              fontSize: '12px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#95856d',
              fontWeight: 800
            }}
          >
            Opportunities
          </p>
          <h2
            style={{
              margin: '12px 0 0',
              color: premiumBlue,
              fontSize: isMobile ? '32px' : '44px',
              letterSpacing: '-0.03em'
            }}
          >
            Explore Our Signature Pathways
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px'
          }}
        >
          {featureCards.map((card) => (
            <div
              key={card.title}
              style={{
                position: 'relative',
                minHeight: '320px',
                borderRadius: '30px',
                overflow: 'hidden',
                cursor: 'pointer',
                boxShadow: '0 20px 48px rgba(0,0,0,0.14)',
                transform: 'translateY(0)',
                transition: 'transform 0.4s ease, box-shadow 0.4s ease'
              }}
              onMouseEnter={(e) => {
                const image = e.currentTarget.querySelector('img') as HTMLImageElement | null
                const title = e.currentTarget.querySelector('h3') as HTMLHeadingElement | null
                const subtitle = e.currentTarget.querySelector('p') as HTMLParagraphElement | null
                e.currentTarget.style.transform = 'translateY(-10px)'
                e.currentTarget.style.boxShadow = '0 28px 60px rgba(0,0,0,0.2)'
                if (image) image.style.transform = 'scale(1.08)'
                if (image) image.style.filter = 'blur(3px) brightness(0.56)'
                if (title) title.style.fontSize = '31px'
                if (subtitle) subtitle.style.opacity = '1'
              }}
              onMouseLeave={(e) => {
                const image = e.currentTarget.querySelector('img') as HTMLImageElement | null
                const title = e.currentTarget.querySelector('h3') as HTMLHeadingElement | null
                const subtitle = e.currentTarget.querySelector('p') as HTMLParagraphElement | null
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 20px 48px rgba(0,0,0,0.14)'
                if (image) image.style.transform = 'scale(1)'
                if (image) image.style.filter = 'blur(1px) brightness(0.72)'
                if (title) title.style.fontSize = '27px'
                if (subtitle) subtitle.style.opacity = '0.86'
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
                  transition: 'transform 0.45s ease, filter 0.45s ease'
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(180deg, rgba(8,26,44,0.04) 0%, rgba(8,26,44,0.78) 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '26px'
                }}
              >
                <div
                  style={{
                    width: '56px',
                    height: '2px',
                    background: `linear-gradient(90deg, ${premiumGold} 0%, rgba(217,181,109,0) 100%)`,
                    marginBottom: '14px'
                  }}
                />
                <h3
                  style={{
                    color: '#ffffff',
                    fontSize: '27px',
                    lineHeight: '1.1',
                    margin: 0,
                    transition: 'font-size 0.4s ease',
                    letterSpacing: '-0.02em'
                  }}
                >
                  {card.title}
                </h3>
                <p
                  style={{
                    margin: '10px 0 0',
                    color: 'rgba(255,255,255,0.92)',
                    fontSize: '14px',
                    lineHeight: 1.7,
                    opacity: 0.86,
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

      <section ref={trustRef} style={{ width: sectionWidth, margin: '62px auto 0' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #081A2C 0%, #0e2a48 58%, #17385e 100%)',
            borderRadius: '30px',
            padding: isMobile ? '24px' : '30px 36px',
            boxShadow: '0 22px 48px rgba(8,26,44,0.18)',
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
                color: '#ffffff',
                padding: '8px 0'
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
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
                  letterSpacing: '0.08em',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)'
                }}
              >
                {item.icon}
              </div>
              <div>
                <div style={{ fontWeight: 700, marginBottom: '6px' }}>{item.title}</div>
                <div
                  style={{
                    fontSize: '14px',
                    lineHeight: 1.65,
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

      <section ref={aboutRef} style={{ width: sectionWidth, margin: '74px auto 96px' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #081A2C 0%, #0d2742 58%, #17385e 100%)',
            padding: isMobile ? '28px' : '48px',
            borderRadius: '34px',
            boxShadow: '0 26px 56px rgba(8,26,44,0.2)',
            color: '#ffffff',
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '0.88fr 1.12fr',
            gap: '32px',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              position: 'absolute',
              right: '-80px',
              top: '-80px',
              width: '240px',
              height: '240px',
              borderRadius: '999px',
              background: 'radial-gradient(circle, rgba(217,181,109,0.24) 0%, rgba(217,181,109,0) 70%)'
            }}
          />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p
              style={{
                margin: '0 0 10px',
                fontSize: '12px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.74)',
                fontWeight: 800
              }}
            >
              About Us
            </p>
            <h2
              style={{
                margin: 0,
                fontSize: isMobile ? '34px' : '46px',
                lineHeight: 1.02,
                letterSpacing: '-0.03em'
              }}
            >
              Who We Are
            </h2>
            <div
              style={{
                width: '72px',
                height: '2px',
                background: `linear-gradient(90deg, ${premiumGold} 0%, rgba(217,181,109,0) 100%)`,
                marginTop: '18px'
              }}
            />
          </div>

          <p
            style={{
              margin: 0,
              fontSize: '16px',
              lineHeight: '2',
              color: 'rgba(255,255,255,0.9)',
              position: 'relative',
              zIndex: 1
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