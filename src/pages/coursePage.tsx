import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from './components/header'
import logo from '../assets/logo.png'
import { apiFetchJson, toDisplayString } from '../services/api'

const premiumBlue = '#081A2C'

const normalizeCategoryKey = (program: Program) => {
  const rawSlug = (program.category?.slug || '').trim()
  return rawSlug || 'uncategorized'
}

const toCategoryLabel = (program: Program) => {
  const name = toDisplayString(program.category?.name).trim()
  if (name) return name

  const slug = normalizeCategoryKey(program)
  if (slug === 'uncategorized') return 'Uncategorized'

  return slug
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

type ProgramCategory = {
  id: number
  name: string
  slug: string
  description: string | null
  is_active: boolean
  created_at?: string
  updated_at?: string
}

type Program = {
  id: number
  program_category_id: number
  slug: string
  title: string
  short_description: string
  overview?: string
  outcomes?: string
  duration: string
  delivery_mode: string
  assessment_method: string
  fees: string
  currency: string
  featured_image: string | null
  is_featured: boolean
  is_active: boolean
  category?: ProgramCategory
}


const CoursePage = () => {
  const navigate = useNavigate()
  const [isMobile, setIsMobile] = useState(false)
  const [programs, setPrograms] = useState<Program[]>([])
  const [isLoadingPrograms, setIsLoadingPrograms] = useState(true)
  const [programsError, setProgramsError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDeliveryMode, setSelectedDeliveryMode] = useState('all')
  const [featuredFilter, setFeaturedFilter] = useState<'all' | 'featured' | 'non-featured'>('all')
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

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('current_user')
    setCurrentUser(null)
    window.location.reload()
  }

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

  useEffect(() => {
    const controller = new AbortController()

    const fetchPrograms = async () => {
      setIsLoadingPrograms(true)
      setProgramsError('')

      try {
        const language = (navigator.language || 'en').slice(0, 2)
        const locale = ['en', 'ar', 'nl'].includes(language) ? language : 'en'

        const data = await apiFetchJson<{ data?: Program[]; message?: string }>('/programs', {
          method: 'GET',
          locale,
          signal: controller.signal
        })

        setPrograms(Array.isArray(data?.data) ? data.data : [])
      } catch (error) {
        if ((error as Error).name === 'AbortError') return
        setProgramsError(error instanceof Error ? error.message : 'Failed to load programs.')
        setPrograms([])
      } finally {
        setIsLoadingPrograms(false)
      }
    }

    fetchPrograms()

    return () => {
      controller.abort()
    }
  }, [])

  const categoryOptions = Array.from(
    new Map(
      programs.map((program) => [normalizeCategoryKey(program), toCategoryLabel(program)])
    ).entries()
  ).map(([slug, name]) => ({ slug, name }))

  const deliveryOptions = Array.from(
    new Set(
      programs
        .map((program) => toDisplayString(program.delivery_mode))
        .filter(Boolean)
    )
  )

  const filteredPrograms = programs.filter((program) => {
    const query = searchTerm.trim().toLowerCase()
    const matchesSearch =
      !query ||
      [
        toDisplayString(program.title),
        toDisplayString(program.short_description),
        toDisplayString(program.category?.name),
        toDisplayString(program.delivery_mode),
        toDisplayString(program.assessment_method),
        toDisplayString(program.duration)
      ]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query))

    const matchesCategory = selectedCategory === 'all' || normalizeCategoryKey(program) === selectedCategory
    const programDeliveryMode = toDisplayString(program.delivery_mode)
    const matchesDeliveryMode = selectedDeliveryMode === 'all' || programDeliveryMode === selectedDeliveryMode
    const matchesFeatured =
      featuredFilter === 'all' ||
      (featuredFilter === 'featured' && program.is_featured) ||
      (featuredFilter === 'non-featured' && !program.is_featured)

    return matchesSearch && matchesCategory && matchesDeliveryMode && matchesFeatured
  })

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

      <div
        style={{
          minHeight: 'calc(100vh - 82px)',
          width: 'min(1240px, calc(100% - 32px))',
          margin: '0 auto',
          padding: '40px 0 56px'
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '28px'
          }}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.92) 0%, #fff9ef 100%)',
              borderRadius: '30px',
              padding: '32px',
              boxShadow: '0 20px 45px rgba(15, 23, 42, 0.08)',
              border: '1px solid rgba(8,26,44,0.06)'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: isMobile ? 'flex-start' : 'center',
                flexDirection: isMobile ? 'column' : 'row',
                gap: '20px',
                marginBottom: '26px'
              }}
            >
              <div>
                <h1
                  style={{
                    margin: 0,
                    fontSize: isMobile ? '32px' : '44px',
                    lineHeight: 1.05,
                    color: premiumBlue,
                    letterSpacing: '-0.03em'
                  }}
                >
                  All Courses 
                </h1>
                <p
                  style={{
                    margin: '14px 0 0',
                    color: '#5b5b5b',
                    lineHeight: 1.8,
                    maxWidth: '760px'
                  }}
                >
                  Browse your upcoming institute courses, track categories, and preview featured programs.
                  This is a temporary showcase layout until the real data is connected from the backend.
                </p>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(2, minmax(120px, 1fr))',
                  gap: '14px',
                  minWidth: isMobile ? '100%' : '290px',
                  width: isMobile ? '100%' : 'auto'
                }}
              >
                {[
                  [String(programs.length), 'Active Courses'],
                  [String(new Set(programs.map((program) => program.category?.name || 'Uncategorized')).size), 'Categories'],
                  [programs.some((program) => program.is_featured) ? 'Yes' : 'No', 'Featured'],
                  [programs.length > 0 ? 'Live' : 'Soon', 'Updates']
                ].map(([value, label]) => (
                  <div
                    key={label}
                    style={{
                      padding: '16px',
                      borderRadius: '22px',
                      background: 'linear-gradient(180deg, #f6efe1 0%, #f1e7d7 100%)',
                      border: '1px solid rgba(8,26,44,0.06)'
                    }}
                  >
                    <div style={{ fontSize: '24px', fontWeight: 800, color: premiumBlue }}>{value}</div>
                    <div style={{ fontSize: '13px', color: '#6e675f', marginTop: '6px' }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '1.2fr auto auto',
                gap: '16px',
                alignItems: 'center'
              }}
            >
              <div
                style={{
                  position: 'relative',
                  width: '100%'
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    left: '18px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#8a8177',
                    display: 'flex',
                    alignItems: 'center'
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
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Search courses, categories, or instructors"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  style={{
                    width: '100%',
                    height: '56px',
                    borderRadius: '999px',
                    border: '1px solid rgba(8,26,44,0.08)',
                    background: '#ffffff',
                    padding: '0 20px 0 50px',
                    outline: 'none',
                    fontSize: '15px',
                    color: premiumBlue,
                    boxShadow: '0 8px 22px rgba(15, 23, 42, 0.04)'
                  }}
                />
              </div>

              <button
                type="button"
                onClick={() => setShowFilters((prev) => !prev)}
                style={{
                  height: '56px',
                  padding: '0 20px',
                  borderRadius: '999px',
                  border: '1px solid rgba(8,26,44,0.1)',
                  background: showFilters ? premiumBlue : '#ffffff',
                  color: showFilters ? '#ffffff' : premiumBlue,
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {showFilters ? 'Hide Filters' : 'Filter'}
              </button>

              <div
                style={{
                  height: '56px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '0 12px',
                  borderRadius: '999px',
                  background: '#ffffff',
                  border: '1px solid rgba(8,26,44,0.08)',
                  boxShadow: '0 8px 22px rgba(15, 23, 42, 0.04)'
                }}
              >
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '999px',
                    border: 'none',
                    background: viewMode === 'grid' ? premiumBlue : 'transparent',
                    color: viewMode === 'grid' ? '#ffffff' : '#8a8177',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                  aria-label="Grid view"
                  title="Grid view"
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
                    <rect x="3" y="3" width="7" height="7" rx="1.5" />
                    <rect x="14" y="3" width="7" height="7" rx="1.5" />
                    <rect x="14" y="14" width="7" height="7" rx="1.5" />
                    <rect x="3" y="14" width="7" height="7" rx="1.5" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '999px',
                    border: 'none',
                    background: viewMode === 'list' ? premiumBlue : 'transparent',
                    color: viewMode === 'list' ? '#ffffff' : '#8a8177',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                  aria-label="List view"
                  title="List view"
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
                    <line x1="8" y1="6" x2="21" y2="6" />
                    <line x1="8" y1="12" x2="21" y2="12" />
                    <line x1="8" y1="18" x2="21" y2="18" />
                    <line x1="3" y1="6" x2="3.01" y2="6" />
                    <line x1="3" y1="12" x2="3.01" y2="12" />
                    <line x1="3" y1="18" x2="3.01" y2="18" />
                  </svg>
                </button>
              </div>
            </div>

            {showFilters && (
              <div
                style={{
                  marginTop: '14px',
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, minmax(0, 1fr))',
                  gap: '12px',
                  alignItems: 'end'
                }}
              >
                <div>
                  <div style={{ fontSize: '12px', color: '#6e675f', marginBottom: '8px', fontWeight: 700 }}>Category</div>
                  <select
                    value={selectedCategory}
                    onChange={(event) => setSelectedCategory(event.target.value)}
                    style={{
                      width: '100%',
                      height: '46px',
                      borderRadius: '12px',
                      border: '1px solid rgba(8,26,44,0.12)',
                      background: '#ffffff',
                      color: premiumBlue,
                      padding: '0 12px'
                    }}
                  >
                    <option value="all">All categories</option>
                    {categoryOptions.map((category) => (
                      <option key={category.slug} value={category.slug}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div style={{ fontSize: '12px', color: '#6e675f', marginBottom: '8px', fontWeight: 700 }}>Delivery</div>
                  <select
                    value={selectedDeliveryMode}
                    onChange={(event) => setSelectedDeliveryMode(event.target.value)}
                    style={{
                      width: '100%',
                      height: '46px',
                      borderRadius: '12px',
                      border: '1px solid rgba(8,26,44,0.12)',
                      background: '#ffffff',
                      color: premiumBlue,
                      padding: '0 12px'
                    }}
                  >
                    <option value="all">All delivery modes</option>
                    {deliveryOptions.map((deliveryMode) => (
                      <option key={deliveryMode} value={deliveryMode}>
                        {deliveryMode}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div style={{ fontSize: '12px', color: '#6e675f', marginBottom: '8px', fontWeight: 700 }}>Featured</div>
                  <select
                    value={featuredFilter}
                    onChange={(event) => setFeaturedFilter(event.target.value as 'all' | 'featured' | 'non-featured')}
                    style={{
                      width: '100%',
                      height: '46px',
                      borderRadius: '12px',
                      border: '1px solid rgba(8,26,44,0.12)',
                      background: '#ffffff',
                      color: premiumBlue,
                      padding: '0 12px'
                    }}
                  >
                    <option value="all">All courses</option>
                    <option value="featured">Featured only</option>
                    <option value="non-featured">Non-featured only</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('all')
                    setSelectedDeliveryMode('all')
                    setFeaturedFilter('all')
                    setSearchTerm('')
                  }}
                  style={{
                    height: '46px',
                    borderRadius: '12px',
                    border: '1px solid rgba(8,26,44,0.12)',
                    background: '#ffffff',
                    color: premiumBlue,
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Reset Filters
                </button>
              </div>
            )}

            <div
              style={{
                marginTop: '12px',
                color: '#6e675f',
                fontSize: '13px'
              }}
            >
              Showing {filteredPrograms.length} of {programs.length} courses
            </div>
          </div>

          <div>
            <div
              style={{
                marginBottom: '24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                textAlign: 'center'
              }}
            >
              <h2
                style={{
                  margin: 0,
                  color: premiumBlue,
                  fontSize: isMobile ? '28px' : '38px',
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  lineHeight: 1.1
                }}
              >
                All Courses
              </h2>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  viewMode === 'list'
                    ? '1fr'
                    : isMobile
                      ? '1fr'
                      : 'repeat(3, minmax(0, 1fr))',
                gap: '22px'
              }}
            >
            {isLoadingPrograms ? (
              Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={`program-skeleton-${index}`}
                  style={{
                    padding: '18px',
                    background: 'transparent',
                    border: '1px solid #d6d6d6',
                    borderRadius: '18px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '18px'
                  }}
                >
                  <div
                    style={{
                      height: '240px',
                      borderRadius: '16px',
                      background: 'linear-gradient(135deg, rgba(8,26,44,0.10) 0%, rgba(13,39,66,0.12) 55%, rgba(217,181,109,0.20) 140%)'
                    }}
                  />
                  <div
                    style={{
                      height: '18px',
                      width: '42%',
                      borderRadius: '999px',
                      background: 'rgba(8,26,44,0.10)'
                    }}
                  />
                  <div
                    style={{
                      height: '48px',
                      width: '100%',
                      borderRadius: '12px',
                      background: 'rgba(8,26,44,0.08)'
                    }}
                  />
                  <div
                    style={{
                      height: '74px',
                      width: '100%',
                      borderRadius: '12px',
                      background: 'rgba(8,26,44,0.06)'
                    }}
                  />
                </div>
              ))
            ) : programsError ? (
              <div
                style={{
                  gridColumn: isMobile ? 'auto' : '1 / -1',
                  padding: '24px',
                  borderRadius: '18px',
                  border: '1px solid rgba(220, 38, 38, 0.18)',
                  background: 'rgba(220, 38, 38, 0.05)',
                  color: '#991b1b',
                  lineHeight: 1.7
                }}
              >
                {programsError}
              </div>
            ) : filteredPrograms.length === 0 ? (
              <div
                style={{
                  gridColumn: isMobile ? 'auto' : '1 / -1',
                  padding: '24px',
                  borderRadius: '18px',
                  border: '1px solid rgba(8,26,44,0.08)',
                  background: 'rgba(255,255,255,0.75)',
                  color: '#4b5563',
                  lineHeight: 1.7
                }}
              >
                No programs found for your search.
              </div>
            ) : (
              filteredPrograms.map((program) => (
                <div
                  key={program.id}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLDivElement
                    if (viewMode === 'list') return
                    el.style.transform = 'scale(1.03)'
                    el.style.background = 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, #fff6e8 100%)'
                    el.style.borderColor = 'rgba(217,181,109,0.5)'
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLDivElement
                    if (viewMode === 'list') return
                    el.style.transform = 'scale(1)'
                    el.style.background = 'transparent'
                    el.style.borderColor = '#d6d6d6'
                  }}
                  style={{
                    padding: '18px',
                    background: 'transparent',
                    border: '1px solid #d6d6d6',
                    borderRadius: '18px',
                    boxShadow: 'none',
                    display: 'flex',
                    flexDirection: viewMode === 'list' && !isMobile ? 'row' : 'column',
                    gap: '18px',
                    transition: 'all 0.25s ease',
                    alignItems: viewMode === 'list' && !isMobile ? 'stretch' : 'initial'
                  }}
                >
                  <div
                    style={{
                      height: viewMode === 'list' && !isMobile ? '220px' : '240px',
                      width: viewMode === 'list' && !isMobile ? '340px' : '100%',
                      flexShrink: viewMode === 'list' && !isMobile ? 0 : 1,
                      borderRadius: '16px',
                      border: '1px solid rgba(8,26,44,0.08)',
                      background: program.featured_image
                        ? `linear-gradient(rgba(8,26,44,0.30), rgba(8,26,44,0.55)), url(${program.featured_image}) center / cover no-repeat`
                        : 'linear-gradient(135deg, rgba(8,26,44,0.96) 0%, rgba(13,39,66,0.92) 55%, rgba(217,181,109,0.75) 140%)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {!program.featured_image && (
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background:
                            'radial-gradient(circle at top right, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 36%)'
                        }}
                      />
                    )}
                    <div
                      style={{
                        position: 'absolute',
                        left: '20px',
                        bottom: '20px',
                        color: '#ffffff',
                        fontWeight: 800,
                        fontSize: '22px',
                        maxWidth: '80%',
                        lineHeight: 1.15,
                        letterSpacing: '-0.02em'
                      }}
                    >
                      {toDisplayString(program.title)}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gap: '18px', flex: 1, alignContent: 'space-between' }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '12px',
                        flexWrap: 'wrap'
                      }}
                    >
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '8px 12px',
                          borderRadius: '999px',
                          background: 'rgba(217,181,109,0.16)',
                          color: '#9a7a37',
                          fontSize: '12px',
                          fontWeight: 700,
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase'
                        }}
                      >
                        {toDisplayString(program.category?.name) || 'Program'}
                      </span>
                      <span
                        style={{
                          color: premiumBlue,
                          fontSize: '12px',
                          fontWeight: 700
                        }}
                      >
                        {program.is_featured ? 'Featured' : toDisplayString(program.delivery_mode)}
                      </span>
                    </div>

                    <p
                      style={{
                        margin: 0,
                        color: '#5f5a54',
                        lineHeight: 1.75,
                        fontSize: '14px'
                      }}
                    >
                      {toDisplayString(program.short_description) ||
                        toDisplayString(program.overview) ||
                        'Program details coming soon.'}
                    </p>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '12px',
                        flexWrap: 'wrap'
                      }}
                    >
                      <div>
                        <div style={{ color: '#8a8177', fontSize: '12px', marginBottom: '4px' }}>Starting from</div>
                        <div style={{ color: premiumBlue, fontSize: '22px', fontWeight: 800 }}>
                          {toDisplayString(program.currency)} {toDisplayString(program.fees)}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => navigate(`/course/${program.slug}`)}
                        style={{
                          padding: '12px 18px',
                          borderRadius: '999px',
                          border: 'none',
                          background: premiumBlue,
                          color: '#ffffff',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Preview
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CoursePage
