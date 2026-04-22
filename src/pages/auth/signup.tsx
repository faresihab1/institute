import '../../styles/auth.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiFetchJson } from '../../services/api'

const Signup = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')
    setIsLoading(true)

    const name = (document.getElementById('name') as HTMLInputElement).value.trim()
    const email = (document.getElementById('email') as HTMLInputElement).value.trim()
    const phone_number = (document.getElementById('phone') as HTMLInputElement).value.trim()
    const password = (document.getElementById('password') as HTMLInputElement).value
    const password_confirmation = (document.getElementById('confirmPassword') as HTMLInputElement).value

    if (!name || !email || !phone_number || !password || !password_confirmation) {
      setErrorMessage('Please fill in all required fields.')
      setIsLoading(false)
      return
    }

    if (password !== password_confirmation) {
      setErrorMessage('Passwords do not match.')
      setIsLoading(false)
      return
    }

    try {
      const data = await apiFetchJson<any>('/register', {
        json: {
          name,
          email,
          phone_number,
          password,
          password_confirmation
        }
      })

      if (data) {
        console.log('Signed up:', data)
        navigate(`/verify?email=${encodeURIComponent(email)}`)
        return
      }
    } catch (err) {
      console.error('Error:', err)
      const status = (err as any)?.status
      const data = (err as any)?.data

      if (status === 422) {
        const validationErrors = data?.errors
        if (validationErrors && typeof validationErrors === 'object') {
          const firstError = Object.values(validationErrors).flat()[0]
          setErrorMessage(typeof firstError === 'string' ? firstError : 'Please check your inputs.')
        } else {
          setErrorMessage((err as any)?.message || data?.message || 'Please check your inputs.')
        }
      } else if (typeof status === 'number' && status >= 500) {
        setErrorMessage('Server error. Please try again later.')
      } else {
        setErrorMessage('Network error. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
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
              <button
                className="login-tab"
                type="button"
                onClick={() => navigate('/login')}
              >
                Sign In
              </button>
              <button className="login-tab active" type="button">
                Create Account
              </button>
            </div>

            <h1 className="login-title">Create Account</h1>
            <p className="login-subtitle">
              Please fill in your details to create an account. After signup, we will send a 6-digit verification code to your email.
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
                  fontSize: '14px'
                }}
              >
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSignup}>
              <div className="field">
                <label>Full Name</label>
                <input id="name" type="text" placeholder="Enter your full name" disabled={isLoading} />
              </div>

              <div className="field">
                <label>Email Address</label>
                <input id="email" type="email" placeholder="Enter your email address" disabled={isLoading} />
              </div>

              <div className="field">
                <label>Phone Number</label>
                <input id="phone" type="tel" placeholder="Enter your phone number" disabled={isLoading} />
              </div>

              <div className="field">
                <label>Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password"
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

              <div className="field">
                <label>Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Rewrite password"
                    disabled={isLoading}
                  />
                  <span
                    onClick={() => setShowConfirmPassword((v) => !v)}
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

              <button className="submit-btn" type="submit" disabled={isLoading}>
                {isLoading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <div className="divider">Or sign up with</div>

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
  )
}

export default Signup
