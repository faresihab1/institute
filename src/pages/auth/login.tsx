import '../../styles/auth.css'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    const email = (document.getElementById('email') as HTMLInputElement).value
    const password = (document.getElementById('password') as HTMLInputElement).value

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

  navigate('/') // go to homepage
} else {
        console.error('Login failed:', data)
      }
    } catch (err) {
      console.error('Error:', err)
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

            <form onSubmit={handleLogin}>
              <div className="field">
                <label>Email Address</label>
                <input id="email" type="email" placeholder="j.doe@iisn.nl" />
              </div>

              <div className="field">
                <div className="field-top">
                  <label>Password</label>
                  <a href="#">Forgot access?</a>
                </div>
                <input id="password" type="password" placeholder="Enter your password" />
              </div>

              <label className="remember">
                <input type="checkbox" />
                <span>Remember this workstation for 30 days</span>
              </label>

              <button className="submit-btn" type="submit">
                Login
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