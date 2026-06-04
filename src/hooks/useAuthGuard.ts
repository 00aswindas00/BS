import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAuthSession } from '../lib/authMock'

export function useAuthGuard() {
  const navigate = useNavigate()
  const session = getAuthSession()

  useEffect(() => {
    if (!session) {
      navigate('/', { replace: true })
    }
  }, [session, navigate])

  return session
}
