import '../../styles/auth.css'
import { useNavigate } from 'react-router-dom'

const Signup = () => {
  const navigate = useNavigate()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    const name = (document.getElementById('name') as HTMLInputElement).value
    const email = (document.getElementById('email') as HTMLInputElement).value
    const phone_number = (document.getElementById('phone') as HTMLInputElement).value
    const password = (document.getElementById('password') as HTMLInputElement).value
    const password_confirmation = (document.getElementById('confirmPassword') as HTMLInputElement).value

    try {
      const res = await fetch('https://international-institute-main-vrqh7a.laravel.cloud/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          phone_number,
          password,
          password_confirmation
        })
      })

      const data = await res.json()

      if (res.ok) {
        console.log('Signed up:', data)
      } else {
        console.error('Signup failed:', data)
      }
    } catch (err) {
      console.error('Error:', err)
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
              Please fill in your details to create an account.
            </p>

            <form onSubmit={handleSignup}>
              <div className="field">
                <label>Username</label>
                <input id="name" type="text" placeholder="Enter username" />
              </div>

              <div className="field">
                <label>Email Address</label>
                <input id="email" type="email" placeholder="Enter email" />
              </div>

              <div className="field">
                <label>Phone Number</label>
                <input id="phone" type="tel" placeholder="Enter phone number" />
              </div>

              <div className="field">
                <label>Password</label>
                <input id="password" type="password" placeholder="Enter password" />
              </div>

              <div className="field">
                <label>Confirm Password</label>
                <input id="confirmPassword" type="password" placeholder="Rewrite password" />
              </div>

              <button className="submit-btn" type="submit">
                Create Account
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
