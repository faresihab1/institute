import '../../styles/auth.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')
    setIsLoading(true)

    const email = (document.getElementById('email') as HTMLInputElement).value.trim()
    const password = (document.getElementById('password') as HTMLInputElement).value

    if (!email || !password) {
      setErrorMessage('Please enter both your email and password.')
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch('https://international-institute-main-vrqh7a.laravel.cloud/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      if (res.ok) {
        console.log('Logged in:', data)
        localStorage.setItem('access_token', data.access_token)
        localStorage.setItem('current_user', JSON.stringify(data.user))
        navigate('/course')
        return
      }

      if (res.status === 401) {
        setErrorMessage('The email or password is incorrect. If you do not have an account yet, please sign up first.')
      } else if (res.status === 422) {
        setErrorMessage(data?.message || 'Please check your email and password and try again.')
      } else if (res.status >= 500) {
        setErrorMessage('The server is currently unavailable. Please try again in a moment.')
      } else {
        setErrorMessage(data?.message || 'Login failed. Please try again.')
      }
    } catch (err) {
      console.error('Error:', err)
      setErrorMessage('Network error. Please check your internet connection and try again.')
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <>
      <div className="login-page">
        <div className="login-shell">
          <div className="login-image-side">
            <img
              className="login-image"
              src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80"
              alt="University campus"
            />

            <div className="login-overlay">
              <div>
                <h1>Welcome to Your Institute</h1>
                <p>
                  Access your academic resources, manage your profile, and stay
                  connected with your institution.
                </p>
              </div>
            </div>
          </div>

        <div className="login-form-side">
          <div className="login-card">
            <div className="login-tabs">
              <button className="login-tab active" type="button">
                Sign In
              </button>
              <button
                className="login-tab"
                type="button"
                onClick={() => navigate('/signup')}
              >
                Create Account
              </button>
            </div>

            <h1 className="login-title">Welcome Back</h1>
            <p className="login-subtitle">
              Please enter your institutional credentials to continue.
            </p>
            {errorMessage && (
              <div
                style={{
                  marginBottom: '16px',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  background: 'rgba(220, 38, 38, 0.08)',
                  border: '1px solid rgba(220, 38, 38, 0.18)',
                  color: '#b91c1c',
                  fontSize: '14px',
                  lineHeight: '1.5'
                }}
              >
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="field">
                <label>Email Address</label>
                <input id="email" type="email" placeholder="j.doe@iisn.nl" disabled={isLoading} />
              </div>

              <div className="field">
                <div className="field-top">
                  <label>Password</label>
                  <a href="#">Forgot access?</a>
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    disabled={isLoading}
                  />
                  <span
                    onClick={() => setShowPassword((v) => !v)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      cursor: 'pointer'
                    }}
                  >
                    👁
                  </span>
                </div>
              </div>

              <label className="remember">
                <input type="checkbox" disabled={isLoading} />
                <span>Remember this workstation for 30 days</span>
              </label>

              <button className="submit-btn" type="submit" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <div className="divider">Institutional single sign on</div>

            <div className="socials">
              <button className="social-btn" type="button">
                Google
              </button>
              <button className="social-btn" type="button">
                LinkedIn
              </button>
            </div>
          </div>
        </div>
        </div>
      </div>
    </>
  )
}

export default Login