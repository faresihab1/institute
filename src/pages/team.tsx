

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from './components/header'
import logo from '../assets/logo.png'

type TeamMember = {
  name: string
  role: string
  description: string
}

const teamMembers: TeamMember[] = [
  {
    name: 'Dr. Sarah Mitchell',
    role: 'Academic Director',
    description:
      'Leads academic strategy, quality assurance, and the development of internationally aligned learning standards.'
  },
  {
    name: 'Michael Van Dijk',
    role: 'Head of Accreditation',
    description:
      'Oversees accreditation frameworks, institutional reviews, and compliance processes across global partner networks.'
  },
  {
    name: 'Amina Rahman',
    role: 'Training Programs Manager',
    description:
      'Designs professional development pathways and supports excellence in training delivery and learner outcomes.'
  },
  {
    name: 'Daniel Foster',
    role: 'Partnerships Lead',
    description:
      'Builds strategic collaborations with institutions, professionals, and organizations to expand international impact.'
  }
]

const TeamPage = () => {
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

    return () => {
      window.removeEventListener('resize', onResize)
    }
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
          maxWidth: '1180px',
          margin: '0 auto',
          padding: isMobile ? '32px 16px 60px' : '56px 24px 80px'
        }}
      >
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, #fff9ef 100%)',
            border: '1px solid rgba(8,26,44,0.06)',
            borderRadius: '28px',
            padding: isMobile ? '28px 20px' : '40px',
            boxShadow: '0 20px 45px rgba(15, 23, 42, 0.08)',
            marginBottom: '36px'
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
            Our Team
          </p>

          <h1
            style={{
              margin: '14px 0 16px',
              fontSize: isMobile ? '36px' : '52px',
              lineHeight: 1,
              letterSpacing: '-0.04em',
              color: '#081A2C'
            }}
          >
            Meet the people behind our standards and vision
          </h1>

          <p
            style={{
              margin: 0,
              maxWidth: '820px',
              color: '#4f4f4f',
              fontSize: isMobile ? '16px' : '18px',
              lineHeight: 1.8
            }}
          >
            Our team brings together expertise in education, accreditation, training, and institutional development to support professionals and organizations worldwide.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, minmax(0, 1fr))',
            gap: '24px'
          }}
        >
          {teamMembers.map((member) => (
            <div
              key={member.name}
              style={{
                background: '#ffffff',
                borderRadius: '22px',
                border: '1px solid rgba(8,26,44,0.08)',
                padding: '24px',
                boxShadow: '0 16px 35px rgba(15, 23, 42, 0.06)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease'
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget
                el.style.transform = 'translateY(-6px)'
                el.style.boxShadow = '0 22px 40px rgba(15, 23, 42, 0.10)'
                el.style.borderColor = 'rgba(214,173,98,0.45)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget
                el.style.transform = 'translateY(0)'
                el.style.boxShadow = '0 16px 35px rgba(15, 23, 42, 0.06)'
                el.style.borderColor = 'rgba(8,26,44,0.08)'
              }}
            >
              <div
                style={{
                  width: '62px',
                  height: '62px',
                  borderRadius: '18px',
                  background: 'linear-gradient(145deg, #f7e7c2 0%, #d6ad62 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#081A2C',
                  fontWeight: 800,
                  fontSize: '22px',
                  marginBottom: '18px'
                }}
              >
                {member.name
                  .split(' ')
                  .slice(0, 2)
                  .map((part) => part[0])
                  .join('')}
              </div>

              <h2
                style={{
                  margin: 0,
                  color: '#081A2C',
                  fontSize: '24px',
                  fontWeight: 800,
                  letterSpacing: '-0.02em'
                }}
              >
                {member.name}
              </h2>

              <div
                style={{
                  marginTop: '8px',
                  color: '#9b8660',
                  fontWeight: 700,
                  fontSize: '14px',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase'
                }}
              >
                {member.role}
              </div>

              <p
                style={{
                  margin: '16px 0 0',
                  color: '#555',
                  lineHeight: 1.75,
                  fontSize: '15px'
                }}
              >
                {member.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TeamPage