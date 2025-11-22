import { useCallback, useEffect, useState } from 'react'

import type { IpcHandlerPayload, SessionSnapshot } from 'shared/types'

const { App } = window

function assertPayload<T>(payload: IpcHandlerPayload<T>): T {
  if (!payload.ok || !payload.data) {
    throw new Error(
      payload.error ?? "We couldn't finish that request. Please try again."
    )
  }

  return payload.data
}

export function useLocalSession() {
  const [session, setSession] = useState<SessionSnapshot | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)

  const applySession = useCallback(
    (snapshot: SessionSnapshot | null) => {
      setSession(snapshot)
      setError(null)
    },
    [setSession]
  )

  const refreshSession = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const payload = await App.getSession()
      const data = assertPayload(payload)
      applySession(data)
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Unable to load your local session.'
      )
      applySession(null)
    } finally {
      setIsLoading(false)
    }
  }, [applySession])

  const logout = useCallback(async () => {
    setIsProcessing(true)
    setError(null)

    try {
      const payload = await App.logout()
      const data = assertPayload(payload)
      applySession(data)
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "We couldn't sign you out locally."
      )
      throw error
    } finally {
      setIsProcessing(false)
    }
  }, [applySession])

  useEffect(() => {
    refreshSession()
  }, [refreshSession])

  return {
    session,
    isLoading,
    isProcessing,
    error,
    refreshSession,
    logout,
    applySession,
    clearError: () => setError(null),
  }
}
