export const DEFAULT_API_ORIGIN = 'https://international-institute-main-vrqh7a.laravel.cloud'

const stripTrailingSlashes = (value: string) => value.replace(/\/+$/, '')

const normalizeApiBaseUrl = (value: string) => {
  const cleaned = stripTrailingSlashes(value.trim())
  return cleaned.endsWith('/api') ? cleaned : `${cleaned}/api`
}

export const API_BASE_URL = normalizeApiBaseUrl(
  (import.meta.env.VITE_API_ORIGIN as string | undefined) || DEFAULT_API_ORIGIN
)

export const apiUrl = (path: string) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${API_BASE_URL}${normalizedPath}`
}

export const getPreferredLocale = () => {
  const language = (navigator.language || 'en').slice(0, 2)
  return ['en', 'ar', 'nl'].includes(language) ? language : 'en'
}

export const toDisplayString = (value: unknown, locale: string = getPreferredLocale()): string => {
  if (value === null || value === undefined) return ''

  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }

  if (Array.isArray(value)) {
    const parts = value
      .map((item) => toDisplayString(item, locale))
      .map((part) => part.trim())
      .filter(Boolean)
    return parts.join(', ')
  }

  if (typeof value === 'object') {
    const record = value as Record<string, unknown>
    const candidate =
      record[locale] ??
      record.en ??
      record.ar ??
      record.nl

    const candidateText = toDisplayString(candidate, locale).trim()
    if (candidateText) return candidateText

    const firstText = Object.values(record)
      .map((item) => toDisplayString(item, locale))
      .map((part) => part.trim())
      .find(Boolean)

    return firstText || ''
  }

  return ''
}

export class ApiError extends Error {
  status: number
  data: unknown

  constructor(message: string, status: number, data: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

type ApiFetchOptions = RequestInit & {
  auth?: boolean
  token?: string | null
  locale?: string
  json?: unknown
}

export const apiFetchJson = async <T = any>(path: string, options: ApiFetchOptions = {}): Promise<T> => {
  const headers = new Headers(options.headers || undefined)
  if (!headers.has('Accept')) headers.set('Accept', 'application/json')

  const locale = options.locale || getPreferredLocale()
  if (!headers.has('Accept-Language')) headers.set('Accept-Language', locale)

  if (options.auth) {
    const token = options.token ?? localStorage.getItem('access_token')
    if (token) headers.set('Authorization', `Bearer ${token}`)
  }

  const requestInit: RequestInit = {
    ...options,
    headers
  }

  if (options.json !== undefined) {
    if (!requestInit.method) requestInit.method = 'POST'
    if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json')
    requestInit.body = JSON.stringify(options.json)
    delete (requestInit as any).json
  } else {
    delete (requestInit as any).json
  }

  const response = await fetch(apiUrl(path), requestInit)

  let data: any = null
  try {
    data = await response.json()
  } catch {
    data = null
  }

  if (!response.ok) {
    const message =
      (data && (data.message || data.error)) ||
      `Request failed (${response.status})`
    throw new ApiError(String(message), response.status, data)
  }

  return data as T
}
