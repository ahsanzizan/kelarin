import { Navigate, Route } from 'react-router-dom'

import { Router } from 'lib/electron-router-dom'

import { AuthScreen } from './screens/auth'
import { MainScreen } from './screens/main'

import { SessionLoading } from 'renderer/components/widgets/session-loading'
import { useSession } from './data/auth/use-session'

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { data: session, isLoading } = useSession()

  if (isLoading) {
    return <SessionLoading />
  }

  if (!isLoading && !session) {
    return <Navigate replace to="/auth" />
  }

  return <>{children}</>
}

export function AppRoutes() {
  return (
    <Router
      main={
        <>
          <Route element={<AuthScreen />} path="/auth" />
          <Route
            element={
              <RequireAuth>
                <MainScreen />
              </RequireAuth>
            }
            path="/"
          />
        </>
      }
    />
  )
}
