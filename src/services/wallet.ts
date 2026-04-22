import { apiFetchJson } from './api'

export const getWallet = async (token: string) => {
  const data = await apiFetchJson<{ data: any }>('/wallet', { auth: true, token })
  return data.data
}
