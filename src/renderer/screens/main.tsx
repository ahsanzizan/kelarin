import { Navigate } from 'react-router-dom'

import { Search } from 'lucide-react'
import { useMemo } from 'react'
import { SidebarLayout } from 'renderer/components/layouts/sidebar.layout'
import { Button } from 'renderer/components/ui/button'
import { SessionLoading } from 'renderer/components/widgets/session-loading'
import { useSession } from 'renderer/data/auth/use-session'
import { useBoards } from 'renderer/data/board/use-boards'
import { useLogout } from 'renderer/data/auth/use-logout'

export function MainScreen() {
  const { data: session, isLoading: isSessionLoading } = useSession()
  const { mutate: logout } = useLogout()
  const { data, isLoading } = useBoards()

  const greeting = useMemo(() => {
    const hour = new Date().getHours()

    if (hour < 5) {
      return {
        title: 'Early Start',
        description: 'A calm start leads to a powerful day ahead.',
      }
    }
    if (hour < 11) {
      return {
        title: 'Morning',
        description: 'Take charge and make today amazing.',
      }
    }
    if (hour < 14) {
      return {
        title: 'Afternoon',
        description: "Keep the momentum — you're doing great.",
      }
    }
    if (hour < 18) {
      return {
        title: 'Evening',
        description: 'Reflect, refocus, and finish strong.',
      }
    }
    return {
      title: 'Night',
      description: 'Late night worker? Remember to rest and recharge.',
    }
  }, [])

  if (isSessionLoading) {
    return <SessionLoading />
  }

  if (!session?.isAuthenticated || !session.user) {
    return <Navigate to={'/auth'} />
  }

  return (
    <SidebarLayout className="flex justify-end">
      <section className="w-11/12">
        <div className="w-full flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">
              {greeting.title}, {session.user.username}
            </h1>
            <p className="text-base text-white/50">{greeting.description}</p>
          </div>
          <div className="flex items-center gap-x-3 bg-white/5 rounded-lg p-2">
            <Button size={'sm'}>Start & Contribute!</Button>
            <Button size={'icon-sm'} variant={'secondary'}>
              <Search />
            </Button>
            <Button size={'icon-sm'} variant={'secondary'}></Button>
            <Button size={'icon-sm'} variant={'secondary'}></Button>
          </div>
        </div>
        <Button
          onClick={() => logout()}
          size={'default'}
          variant={'destructive'}
        >
          Logout
        </Button>
      </section>
    </SidebarLayout>
  )
}
