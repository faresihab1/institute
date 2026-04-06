import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { BASE_URL } from '../../services/api'

type HeaderProps = {
  currentUser: {
    id?: number
    name?: string
    username?: string
    email?: string
  } | null
  isMobile: boolean
  onLogout: () => void
  logoSrc: string
}

const premiumBlue = '#081A2C'

const Header = ({ currentUser, isMobile, onLogout, logoSrc }: HeaderProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [walletBalance, setWalletBalance] = useState<number | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('access_token')

    if (!token || !currentUser) {
      setWalletBalance(null)
      return
    }

    const controller = new AbortController()

    const fetchWallet = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/wallet`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
          },
          signal: controller.signal
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data?.message || 'Failed to load wallet')
        }

        setWalletBalance(typeof data?.data?.balance === 'number' ? data.data.balance : Number(data?.data?.balance ?? 0))
      } catch (error) {
        if ((error as Error).name === 'AbortError') return
        setWalletBalance(null)
      }
    }

    fetchWallet()

    return () => {
      controller.abort()
    }
  }, [currentUser])

  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        backdropFilter: 'blur(18px)',
        background: 'rgba(8, 26, 44, 0.86)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 12px 30px rgba(8,26,44,0.12)',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          width: isMobile ? 'calc(100% - 24px)' : 'min(1240px, calc(100% - 32px))',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: isMobile ? '12px' : '16px',
          padding: isMobile ? '12px 0' : '18px 0',
          minHeight: isMobile ? '72px' : 'auto'
        }}
      >
        <button
          type="button"
          onClick={() => navigate('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: 0,
            background: 'transparent',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            textAlign: 'left',
            lineHeight: 0,
            flexShrink: 0,
            margin: isMobile ? 0 : -100,
            maxWidth: isMobile ? '160px' : 'none',
            overflow: 'hidden'
          }}
        >
          <img
            src={logoSrc}
            alt="International Institute logo"
            style={{
              width: isMobile ? '150px' : '420px',
              height: 'auto',
              maxHeight: isMobile ? '40px' : '110px',
              objectFit: 'contain',
              objectPosition: 'left center',
              display: 'block'
            }}
          />
        </button>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '18px',
            flex: 1,
            minWidth: 0
          }}
        >
          {!isMobile && (
            <>
              <button
                type="button"
                onClick={() => navigate('/')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: location.pathname === '/' ? '#d6ad62' : '#ffffff',
                  fontWeight: 700,
                  fontSize: '16px',
                  cursor: 'pointer',
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLButtonElement).style.color = '#d6ad62'
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLButtonElement).style.color =
                    location.pathname === '/' ? '#d6ad62' : '#ffffff'
                }}
              >
                Home
              </button>

              <button
                type="button"
                onClick={() => navigate('/course')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: location.pathname === '/course' ? '#d6ad62' : '#ffffff',
                  fontWeight: 700,
                  fontSize: '16px',
                  cursor: 'pointer',
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLButtonElement).style.color = '#d6ad62'
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLButtonElement).style.color =
                    location.pathname === '/course' ? '#d6ad62' : '#ffffff'
                }}
              >
                Courses
              </button>

              <button
                type="button"
                onClick={() => navigate('/about')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: location.pathname === '/about' ? '#d6ad62' : '#ffffff',
                  fontWeight: 700,
                  fontSize: '16px',
                  cursor: 'pointer',
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLButtonElement).style.color = '#d6ad62'
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLButtonElement).style.color =
                    location.pathname === '/about' ? '#d6ad62' : '#ffffff'
                }}
              >
                About Us
              </button>

              <button
                type="button"
                onClick={() => navigate('/team')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: location.pathname === '/team' ? '#d6ad62' : '#ffffff',
                  fontWeight: 700,
                  fontSize: '16px',
                  cursor: 'pointer',
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLButtonElement).style.color = '#d6ad62'
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLButtonElement).style.color =
                    location.pathname === '/team' ? '#d6ad62' : '#ffffff'
                }}
              >
                Our Team
              </button>

              <button
                type="button"
                onClick={() => navigate('/contact')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: location.pathname === '/contact' ? '#d6ad62' : '#ffffff',
                  fontWeight: 700,
                  fontSize: '16px',
                  cursor: 'pointer',
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLButtonElement).style.color = '#d6ad62'
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLButtonElement).style.color =
                    location.pathname === '/contact' ? '#d6ad62' : '#ffffff'
                }}
              >
                Contact Us
              </button>
            </>
          )}
        </div>

        {isMobile && (
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
            style={{
              width: '42px',
              height: '42px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#10263D',
              color: '#ffffff',
              border: '1px solid rgba(255,255,255,0.18)',
              borderRadius: '12px',
              cursor: 'pointer',
              flexShrink: 0
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        )}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: isMobile ? '8px' : '12px',
            flexShrink: 0,
            marginLeft: isMobile ? 'auto' : 0
          }}
        >
          {currentUser ? (
            <>
              {!isMobile && (
                <div
                  style={{
                    padding: '12px 18px',
                    borderRadius: '999px',
                    background: '#10263D', 
                    color: '#ffffff',
                    border: '1px solid rgba(255,255,255,0.14)',
                    fontWeight: 700,
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)'
                  }}
                >
                  {currentUser.name || currentUser.username || currentUser.email}
                </div>
              )}

              {!isMobile && walletBalance !== null && (
                <div
                  style={{
                    padding: '12px 18px',
                    borderRadius: '999px',
                    background: '#10263D',
                    color: '#d6ad62',
                    border: '1px solid rgba(255,255,255,0.14)',
                    fontWeight: 800,
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {walletBalance} II Points
                </div>
              )}

              {!isMobile && (
                <button
                  type="button"
                  onClick={onLogout}
                  aria-label="Logout"
                  title="Logout"
                  style={{
                    width: '46px',
                    height: '46px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#10263D',
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
              )}
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
      {isMobile && menuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            background: 'rgba(0,0,0,0.55)',
            display: 'flex'
          }}
          onClick={() => setMenuOpen(false)}
        >
          <div
            style={{
              width: 'min(320px, calc(100% - 56px))',
              height: '100%',
              background: '#081A2C',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              boxShadow: '12px 0 32px rgba(0,0,0,0.32)',
              borderRight: '1px solid rgba(255,255,255,0.08)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '4px'
              }}
            >
              <div style={{ color: '#ffffff', fontWeight: 800, fontSize: '18px' }}>Menu</div>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
                style={{
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(255,255,255,0.08)',
                  color: '#ffffff',
                  border: '1px solid rgba(255,255,255,0.14)',
                  borderRadius: '10px',
                  cursor: 'pointer'
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            {currentUser && (
              <div
                style={{
                  display: 'grid',
                  gap: '10px',
                  marginBottom: '8px'
                }}
              >
                <div
                  style={{
                    padding: '12px 14px',
                    borderRadius: '12px',
                    background: '#10263D',
                    color: '#ffffff',
                    border: '1px solid rgba(255,255,255,0.12)',
                    fontWeight: 700
                  }}
                >
                  {currentUser.name || currentUser.username || currentUser.email}
                </div>

                {walletBalance !== null && (
                  <div
                    style={{
                      padding: '12px 14px',
                      borderRadius: '12px',
                      background: '#10263D',
                      color: '#d6ad62',
                      border: '1px solid rgba(255,255,255,0.12)',
                      fontWeight: 800
                    }}
                  >
                    {walletBalance} II Points
                  </div>
                )}
              </div>
            )}
            <button
              onClick={() => { setMenuOpen(false); navigate('/'); }}
              style={{
                background: '#10263D',
                border: '1px solid rgba(255,255,255,0.10)',
                color: '#fff',
                fontSize: '16px',
                textAlign: 'left',
                cursor: 'pointer',
                padding: '12px 14px',
                borderRadius: '10px'
              }}
            >Home</button>

            <button
              onClick={() => { setMenuOpen(false); navigate('/course'); }}
              style={{
                background: '#10263D',
                border: '1px solid rgba(255,255,255,0.10)',
                color: '#fff',
                fontSize: '16px',
                textAlign: 'left',
                cursor: 'pointer',
                padding: '12px 14px',
                borderRadius: '10px'
              }}
            >Courses</button>

            <button
              onClick={() => { setMenuOpen(false); navigate('/about'); }}
              style={{
                background: '#10263D',
                border: '1px solid rgba(255,255,255,0.10)',
                color: '#fff',
                fontSize: '16px',
                textAlign: 'left',
                cursor: 'pointer',
                padding: '12px 14px',
                borderRadius: '10px'
              }}
            >About Us</button>

            <button
              onClick={() => { setMenuOpen(false); navigate('/team'); }}
              style={{
                background: '#10263D',
                border: '1px solid rgba(255,255,255,0.10)',
                color: '#fff',
                fontSize: '16px',
                textAlign: 'left',
                cursor: 'pointer',
                padding: '12px 14px',
                borderRadius: '10px'
              }}
            >Our Team</button>

            <button
              onClick={() => { setMenuOpen(false); navigate('/contact'); }}
              style={{
                background: '#10263D',
                border: '1px solid rgba(255,255,255,0.10)',
                color: '#fff',
                fontSize: '16px',
                textAlign: 'left',
                cursor: 'pointer',
                padding: '12px 14px',
                borderRadius: '10px'
              }}
            >Contact Us</button>

            {currentUser ? (
              <button
                onClick={() => { setMenuOpen(false); onLogout(); }}
                style={{
                  marginTop: 'auto',
                  background: '#10263D',
                  border: '1px solid rgba(255,255,255,0.16)',
                  color: '#fff',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  cursor: 'pointer'
                }}
              >Logout</button>
            ) : (
              <button
                onClick={() => { setMenuOpen(false); navigate('/login'); }}
                style={{
                  marginTop: 'auto',
                  background: '#10263D',
                  border: '1px solid rgba(255,255,255,0.16)',
                  color: '#fff',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  cursor: 'pointer'
                }}
              >Sign In</button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Header