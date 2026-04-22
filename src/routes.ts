type RouteValue = string | number

const buildSearch = (entries: Array<[string, RouteValue | null | undefined]>) => {
  const searchParams = new URLSearchParams()

  entries.forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      searchParams.set(key, String(value))
    }
  })

  const search = searchParams.toString()

  return search ? `?${search}` : ''
}

export const appRoutes = {
  home: '/',
  login: '/login',
  signup: '/signup',
  verify: '/verify',
  courses: '/course',
  about: '/about',
  team: '/team',
  contact: '/contact',
  courseDetails: (slug: RouteValue) => `/course/${slug}`,
  courseLearning: (slug: RouteValue) => `/learn/${slug}`,
  lesson: (slug: RouteValue, lessonId: RouteValue, sectionId?: RouteValue | null) =>
    `/learn/${slug}/lesson/${lessonId}${buildSearch([['section', sectionId]])}`,
  quiz: (slug: RouteValue, sectionId: RouteValue) => `/learn/${slug}/quiz/${sectionId}`,
  legacyLesson: (lessonId: RouteValue, slug?: RouteValue | null, sectionId?: RouteValue | null) =>
    `/lesson/${lessonId}${buildSearch([
      ['slug', slug],
      ['section', sectionId]
    ])}`,
  legacyQuiz: (sectionId: RouteValue, slug?: RouteValue | null) =>
    `/quiz/${sectionId}${buildSearch([['slug', slug]])}`
} as const

export const getRedirectLoginPath = (targetPath: string) =>
  `${appRoutes.login}${buildSearch([['redirect', targetPath]])}`

export const normalizeRedirectTarget = (target: string | null | undefined) => {
  if (!target || !target.startsWith('/')) {
    return appRoutes.courses
  }

  if (target.startsWith('//')) {
    return appRoutes.courses
  }

  return target
}

export const getCurrentPath = (pathname: string, search: string) => `${pathname}${search}`

export const isCoursesRoute = (pathname: string) =>
  pathname === appRoutes.courses ||
  pathname.startsWith('/course/') ||
  pathname.startsWith('/learn/') ||
  pathname.startsWith('/lesson/') ||
  pathname.startsWith('/quiz/')
