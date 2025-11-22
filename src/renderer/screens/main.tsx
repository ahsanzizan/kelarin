import { Navigate } from 'react-router-dom'

import { SidebarLayout } from 'renderer/components/layouts/sidebar-layout'
import { SessionLoading } from 'renderer/components/widgets/session-loading'
import { useLocalSession } from '../hooks/use-local-session'

export function MainScreen() {
  const { session, isLoading, isProcessing, error, logout, applySession } =
    useLocalSession()

  if (isLoading) {
    return <SessionLoading />
  }

  if (!session?.isAuthenticated || !session.user) {
    return <Navigate to={'/auth'} />
  }

  return (
    <SidebarLayout className="flex flex-col items-center justify-center"></SidebarLayout>
  )
}
