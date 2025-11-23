import { Route } from 'react-router-dom'

import { Router } from 'lib/electron-router-dom'

import { AuthScreen } from './screens/auth'
import { MainScreen } from './screens/main'

export function AppRoutes() {
  return (
    <Router
      main={
        <>
          <Route element={<MainScreen />} path="/" />
          <Route element={<AuthScreen />} path="/auth" />
        </>
      }
    />
  )
}
