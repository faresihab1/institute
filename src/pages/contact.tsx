import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from './components/header'
import logo from '../assets/logo.png'

const ContactPage = () => {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768)

  useEffect(() => {
    const raw =
      localStorage.getItem('current_user') ||
      localStorage.getItem('currentUser') ||
      localStorage.getItem('user')

    if (raw) {
      try {
        setCurrentUser(JSON.parse(raw))
      } catch {
        setCurrentUser(null)
      }
    }

    const onResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('current_user')
    localStorage.removeItem('currentUser')
    localStorage.removeItem('user')
    navigate('/')
    window.location.reload()
  }

  const phone = '+31653328121'
  const email = 'info@internationalinstitute.nl'

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at top, rgba(217,181,109,0.14), transparent 18%), linear-gradient(180deg, #f8f3ea 0%, #f3ede4 52%, #efe7dc 100%)'
      }}
    >
      <Header
        currentUser={currentUser}
        isMobile={isMobile}
        onLogout={handleLogout}
        logoSrc={logo}
      />

      <div
        style={{
          maxWidth: '1160px',
          margin: '0 auto',
          padding: isMobile ? '32px 16px 60px' : '56px 24px 80px'
        }}
      >
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, #fff9ef 100%)',
            border: '1px solid rgba(8,26,44,0.06)',
            borderRadius: '28px',
            padding: isMobile ? '28px 20px' : '42px',
            boxShadow: '0 20px 45px rgba(15, 23, 42, 0.08)',
            marginBottom: '32px'
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: '12px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#9b8660',
              fontWeight: 800
            }}
          >
            Contact Us
          </p>

          <h1
            style={{
              margin: '14px 0 16px',
              fontSize: isMobile ? '36px' : '54px',
              lineHeight: 1,
              letterSpacing: '-0.04em',
              color: '#081A2C'
            }}
          >
            Let&apos;s start a conversation
          </h1>

          <p
            style={{
              margin: 0,
              maxWidth: '760px',
              color: '#4f4f4f',
              fontSize: isMobile ? '16px' : '18px',
              lineHeight: 1.8
            }}
          >
            Reach out to our team for accreditation inquiries, partnerships, training opportunities, or any general support. We are here to help you with fast and professional guidance.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1.15fr 0.85fr',
            gap: '24px',
            alignItems: 'stretch'
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '24px',
              border: '1px solid rgba(8,26,44,0.08)',
              padding: isMobile ? '24px 20px' : '30px',
              boxShadow: '0 16px 35px rgba(15, 23, 42, 0.06)'
            }}
          >
            <h2
              style={{
                margin: 0,
                color: '#081A2C',
                fontSize: isMobile ? '28px' : '34px',
                fontWeight: 800,
                letterSpacing: '-0.03em'
              }}
            >
              We&apos;d love to hear from you
            </h2>

            <p
              style={{
                margin: '14px 0 0',
                color: '#5a5a5a',
                fontSize: '15px',
                lineHeight: 1.8
              }}
            >
              Choose the way that works best for you. Whether you prefer WhatsApp for quick communication or email for detailed inquiries, our team is ready to respond.
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: '18px',
                marginTop: '28px'
              }}
            >
              <a
                href={`https://wa.me/${phone.replace('+', '')}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  textDecoration: 'none',
                  background: 'linear-gradient(135deg, #10263D 0%, #163856 100%)',
                  color: '#fff',
                  padding: isMobile ? '20px' : '24px',
                  borderRadius: '20px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  boxShadow: '0 16px 30px rgba(8,26,44,0.18)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = '0 20px 34px rgba(8,26,44,0.24)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 16px 30px rgba(8,26,44,0.18)'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                    flexWrap: 'wrap'
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: '12px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.14em',
                        color: 'rgba(255,255,255,0.68)',
                        fontWeight: 700,
                        marginBottom: '8px'
                      }}
                    >
                      WhatsApp
                    </div>
                    <div
                      style={{
                        fontSize: isMobile ? '22px' : '28px',
                        fontWeight: 800,
                        lineHeight: 1.2
                      }}
                    >
                      +31 6 53328121
                    </div>
                  </div>
                  <div
                    style={{
                      color: '#d6ad62',
                      fontWeight: 700,
                      fontSize: '14px'
                    }}
                  >
                    Message us →
                  </div>
                </div>
              </a>

              <a
                href={`mailto:${email}`}
                style={{
                  textDecoration: 'none',
                  background: '#ffffff',
                  color: '#081A2C',
                  padding: isMobile ? '20px' : '24px',
                  borderRadius: '20px',
                  border: '1px solid rgba(8,26,44,0.08)',
                  boxShadow: '0 10px 24px rgba(15, 23, 42, 0.05)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = '0 16px 28px rgba(15, 23, 42, 0.10)'
                  e.currentTarget.style.borderColor = 'rgba(214,173,98,0.45)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 10px 24px rgba(15, 23, 42, 0.05)'
                  e.currentTarget.style.borderColor = 'rgba(8,26,44,0.08)'
                }}
              >
                <div
                  style={{
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.14em',
                    color: '#9b8660',
                    fontWeight: 700,
                    marginBottom: '8px'
                  }}
                >
                  Email
                </div>
                <div
                  style={{
                    fontSize: isMobile ? '20px' : '26px',
                    fontWeight: 800,
                    lineHeight: 1.25,
                    wordBreak: 'break-word'
                  }}
                >
                  {email}
                </div>
              </a>
            </div>
          </div>

          <div
            style={{
              background: 'linear-gradient(180deg, #10263D 0%, #0b1e31 100%)',
              borderRadius: '24px',
              padding: isMobile ? '24px 20px' : '30px',
              color: '#ffffff',
              boxShadow: '0 18px 38px rgba(8,26,44,0.16)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div
                style={{
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.18em',
                  color: '#d6ad62',
                  fontWeight: 800,
                  marginBottom: '14px'
                }}
              >
                Quick Info
              </div>

              <h3
                style={{
                  margin: 0,
                  fontSize: isMobile ? '28px' : '34px',
                  lineHeight: 1.1,
                  letterSpacing: '-0.03em'
                }}
              >
                Available for inquiries and collaboration
              </h3>

              <p
                style={{
                  margin: '16px 0 0',
                  color: 'rgba(255,255,255,0.76)',
                  lineHeight: 1.8,
                  fontSize: '15px'
                }}
              >
                We support institutions, professionals, and partners with responsive communication and internationally focused services.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gap: '14px',
                marginTop: '28px'
              }}
            >
              {[
                ['Fast Response', 'Reach us directly on WhatsApp'],
                ['Professional Support', 'For accreditation and institutional inquiries'],
                ['Email Communication', 'For formal requests and documentation']
              ].map(([title, text]) => (
                <div
                  key={title}
                  style={{
                    padding: '16px',
                    borderRadius: '16px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.08)'
                  }}
                >
                  <div
                    style={{
                      color: '#ffffff',
                      fontWeight: 700,
                      marginBottom: '6px'
                    }}
                  >
                    {title}
                  </div>
                  <div
                    style={{
                      color: 'rgba(255,255,255,0.70)',
                      fontSize: '14px',
                      lineHeight: 1.6
                    }}
                  >
                    {text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage