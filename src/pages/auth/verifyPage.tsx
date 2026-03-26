import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const VerifyPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email') || ''
  const [digits, setDigits] = useState(['', '', '', '', '', ''])
  const [isMobile, setIsMobile] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

  const verificationCode = useMemo(() => digits.join(''), [digits])

  useEffect(() => {
    const updateViewport = () => {
      setIsMobile(window.innerWidth < 900)
    }

    updateViewport()
    window.addEventListener('resize', updateViewport)

    return () => {
      window.removeEventListener('resize', updateViewport)
    }
  }, [])

  const handleChange = (index: number, value: string) => {
    const cleanValue = value.replace(/\D/g, '').slice(-1)
    const updated = [...digits]
    updated[index] = cleanValue
    setDigits(updated)

    if (cleanValue && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }

    if (event.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }

    if (event.key === 'ArrowRight' && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault()
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)

    if (!pasted) return

    const updated = [...digits]
    pasted.split('').forEach((char, index) => {
      updated[index] = char
    })
    setDigits(updated)

    const focusIndex = Math.min(pasted.length, 5)
    inputRefs.current[focusIndex]?.focus()
  }

  const handleVerify = async (event: React.FormEvent) => {
    event.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')

    if (!email) {
      setErrorMessage('Missing email address. Please sign up again or return to login.')
      return
    }

    if (verificationCode.length !== 6) {
      setErrorMessage('Please enter the full 6-digit verification code.')
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch('https://international-institute-main-vrqh7a.laravel.cloud/api/otp/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          code: verificationCode
        })
      })

      const data = await res.json()

      if (res.ok) {
        console.log('OTP verified:', data)
        setSuccessMessage(data?.message || 'Email verified successfully. You can now log in.')
        setTimeout(() => {
          navigate('/login')
        }, 900)
        return
      }

      if (res.status === 422) {
        const validationErrors = data?.errors
        if (validationErrors && typeof validationErrors === 'object') {
          const firstError = Object.values(validationErrors).flat()[0]
          setErrorMessage(typeof firstError === 'string' ? firstError : 'Invalid verification code.')
        } else {
          setErrorMessage(data?.message || 'Invalid verification code.')
        }
      } else if (res.status === 404) {
        setErrorMessage(data?.message || 'Verification request not found. Please register again.')
      } else {
        setErrorMessage(data?.message || 'Verification failed. Please try again.')
      }
    } catch (error) {
      console.error('Verify OTP error:', error)
      setErrorMessage('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    setErrorMessage('')
    setSuccessMessage('')

    if (!email) {
      setErrorMessage('Missing email address. Please sign up again or return to login.')
      return
    }

    setIsResending(true)

    try {
      const res = await fetch('https://international-institute-main-vrqh7a.laravel.cloud/api/otp/resend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      })

      const data = await res.json()

      if (res.ok) {
        setSuccessMessage(data?.message || 'A new verification code has been sent to your email.')
        return
      }

      if (res.status === 422) {
        const validationErrors = data?.errors
        if (validationErrors && typeof validationErrors === 'object') {
          const firstError = Object.values(validationErrors).flat()[0]
          setErrorMessage(typeof firstError === 'string' ? firstError : 'Could not resend verification code.')
        } else {
          setErrorMessage(data?.message || 'Could not resend verification code.')
        }
      } else {
        setErrorMessage(data?.message || 'Could not resend verification code.')
      }
    } catch (error) {
      console.error('Resend OTP error:', error)
      setErrorMessage('Network error. Please try again.')
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isMobile ? '14px' : '24px',
        background:
          'radial-gradient(circle at top, rgba(217,181,109,0.18), transparent 22%), linear-gradient(180deg, #f8f3ea 0%, #f3ede4 52%, #efe7dc 100%)'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '960px',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 1fr) minmax(0, 520px)',
          background: '#ffffff',
          borderRadius: isMobile ? '22px' : '32px',
          overflow: 'hidden',
          boxShadow: '0 28px 70px rgba(13, 25, 45, 0.16)',
          border: '1px solid rgba(8, 26, 44, 0.06)'
        }}
      >
        {!isMobile && (
          <div
            style={{
              position: 'relative',
              minHeight: '620px',
              background:
                'linear-gradient(160deg, rgba(8,26,44,0.98) 0%, rgba(13,39,66,0.94) 56%, rgba(217,181,109,0.72) 160%)',
              padding: isMobile ? '24px' : '40px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: 'linear-gradient(145deg, #f7e7c2 0%, #d6ad62 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#081A2C',
                fontWeight: 800,
                fontSize: '16px',
                boxShadow: '0 14px 28px rgba(0,0,0,0.22)'
              }}
            >
              II
            </div>

            <div>
              <p
                style={{
                  margin: '0 0 14px',
                  color: '#f1d9a0',
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase'
                }}
              >
                Secure Verification
              </p>
              <h1
                style={{
                  margin: 0,
                  color: '#ffffff',
                  fontSize: 'clamp(38px, 4.5vw, 58px)',
                  lineHeight: 0.98,
                  letterSpacing: '-0.03em'
                }}
              >
                Enter the 6-digit code sent to your email
              </h1>
              <p
                style={{
                  margin: '18px 0 0',
                  color: 'rgba(255,255,255,0.82)',
                  fontSize: '16px',
                  lineHeight: 1.8,
                  maxWidth: '420px'
                }}
              >
                We have sent a verification code to your inbox to confirm your identity and secure your account access.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, minmax(0, 1fr))',
                gap: '12px'
              }}
            >
              {[
                ['6 Digits', 'Quick email verification'],
                ['Secure', 'One-time access code'],
                ['Instant', 'Ready for backend later']
              ].map(([title, text]) => (
                <div
                  key={title}
                  style={{
                    padding: '16px',
                    borderRadius: '18px',
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(8px)'
                  }}
                >
                  <div style={{ color: '#ffffff', fontWeight: 700, marginBottom: '6px', fontSize: '14px' }}>
                    {title}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.72)', fontSize: '12px', lineHeight: 1.6 }}>
                    {text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div
          style={{
            padding: isMobile ? '26px 18px' : '48px 40px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            background: 'linear-gradient(180deg, #ffffff 0%, #fcf8f2 100%)'
          }}
        >
          <div style={{ marginBottom: '28px' }}>
            <p
              style={{
                margin: '0 0 10px',
                color: '#9b8660',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.16em',
                textTransform: 'uppercase'
              }}
            >
              Verify Email
            </p>
            <h2
              style={{
                margin: 0,
                color: '#081A2C',
                fontSize: isMobile ? '30px' : '42px',
                lineHeight: 1.05,
                letterSpacing: '-0.03em'
              }}
            >
              Confirmation Code
            </h2>
            <p
              style={{
                margin: '14px 0 0',
                color: '#6f675d',
                fontSize: '15px',
                lineHeight: 1.8
              }}
            >
              {email
                ? `Enter the six numbers sent to ${email}. You can also paste the full code directly.`
                : 'Enter the six numbers from your email message. You can also paste the full code directly.'}
            </p>

            {errorMessage && (
              <div
                style={{
                  marginTop: '16px',
                  padding: '12px 14px',
                  borderRadius: '14px',
                  background: 'rgba(220, 38, 38, 0.08)',
                  border: '1px solid rgba(220, 38, 38, 0.18)',
                  color: '#b91c1c',
                  fontSize: '14px',
                  lineHeight: 1.6
                }}
              >
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div
                style={{
                  marginTop: '16px',
                  padding: '12px 14px',
                  borderRadius: '14px',
                  background: 'rgba(34, 197, 94, 0.08)',
                  border: '1px solid rgba(34, 197, 94, 0.18)',
                  color: '#166534',
                  fontSize: '14px',
                  lineHeight: 1.6
                }}
              >
                {successMessage}
              </div>
            )}
          </div>

          <form onSubmit={handleVerify}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
                gap: isMobile ? '8px' : '12px',
                marginBottom: '24px'
              }}
            >
              {digits.map((digit, index) => (
                <input
                  key={index}
                  ref={(element) => {
                    inputRefs.current[index] = element
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(event) => handleChange(index, event.target.value)}
                  onKeyDown={(event) => handleKeyDown(index, event)}
                  onPaste={handlePaste}
                  disabled={isLoading || isResending}
                  style={{
                    height: isMobile ? '58px' : '72px',
                    borderRadius: isMobile ? '16px' : '20px',
                    border: '1px solid rgba(8,26,44,0.10)',
                    background: '#ffffff',
                    textAlign: 'center',
                    fontSize: isMobile ? '22px' : '28px',
                    fontWeight: 800,
                    color: '#081A2C',
                    outline: 'none',
                    boxShadow: '0 10px 24px rgba(15, 23, 42, 0.05)'
                  }}
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading || isResending}
              style={{
                width: '100%',
                height: '56px',
                border: 'none',
                borderRadius: '999px',
                background: 'linear-gradient(135deg, #081A2C 0%, #133455 100%)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '15px',
                cursor: isLoading || isResending ? 'not-allowed' : 'pointer',
                opacity: isLoading || isResending ? 0.75 : 1,
                boxShadow: '0 16px 30px rgba(8,26,44,0.18)'
              }}
            >
              {isLoading ? 'Verifying...' : 'Verify Account'}
            </button>
          </form>

          <div
            style={{
              marginTop: '22px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              flexWrap: 'wrap'
            }}
          >
            <button
              type="button"
              onClick={() => navigate('/login')}
              style={{
                background: 'transparent',
                border: 'none',
                padding: 0,
                color: '#9b8660',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Back to login
            </button>

            <button
              type="button"
              onClick={handleResend}
              disabled={isLoading || isResending}
              style={{
                background: 'transparent',
                border: 'none',
                padding: 0,
                color: '#081A2C',
                fontWeight: 700,
                cursor: isLoading || isResending ? 'not-allowed' : 'pointer',
                opacity: isLoading || isResending ? 0.65 : 1
              }}
            >
              {isResending ? 'Sending...' : 'Resend code'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerifyPage