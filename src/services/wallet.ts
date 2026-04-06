import { BASE_URL } from './api'

export const getWallet = async (token: string) => {
  const response = await fetch(`${BASE_URL}/api/wallet`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data?.message || 'Failed to load wallet')
  }

  return data.data
}