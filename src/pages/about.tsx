import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from './components/header'
import logo from '../assets/logo.png'

const AboutPage = () => {
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

  return (
    <div style={{ minHeight: '100vh', background: '#f5f1e8' }}>
      <Header
        currentUser={currentUser}
        isMobile={isMobile}
        onLogout={handleLogout}
        logoSrc={logo}
      />

      <div
        style={{
          maxWidth: '1100px',
          margin: '60px auto',
          padding: '0 20px'
        }}
      >
        <h1
          style={{
            fontSize: '42px',
            fontWeight: 800,
            marginBottom: '20px',
            color: '#081A2C'
          }}
        >
          About Us
        </h1>

        <p
          style={{
            fontSize: '18px',
            lineHeight: 1.7,
            color: '#333',
            maxWidth: '800px'
          }}
        >
          The International Institute for Studies Netherlands B.V. is a
          distinguished international organization dedicated to delivering
          high-quality education, certification, and institutional
          accreditation. Our mission is to empower professionals and
          organizations worldwide through innovative learning solutions and
          globally recognized standards.
        </p>

        <div
          style={{
            marginTop: '50px',
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr',
            gap: '24px'
          }}
        >
          {[
            {
              title: 'Our Mission',
              text: 'To provide world-class education and accreditation that supports professional growth and institutional excellence.'
            },
            {
              title: 'Our Vision',
              text: 'To become a global leader in professional education and international accreditation standards.'
            },
            {
              title: 'Our Values',
              text: 'Integrity, innovation, excellence, and a commitment to empowering learners worldwide.'
            }
          ].map((item) => (
            <div
              key={item.title}
              style={{
                background: '#ffffff',
                padding: '24px',
                borderRadius: '16px',
                border: '1px solid #e0e0e0',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget
                el.style.transform = 'translateY(-4px)'
                el.style.boxShadow = '0 10px 25px rgba(0,0,0,0.08)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget
                el.style.transform = 'translateY(0)'
                el.style.boxShadow = 'none'
              }}
            >
              <h3
                style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  marginBottom: '10px',
                  color: '#081A2C'
                }}
              >
                {item.title}
              </h3>
              <p style={{ color: '#555', lineHeight: 1.6 }}>{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AboutPage