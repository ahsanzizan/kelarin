import { useQuery } from '@tanstack/react-query'

const { App } = window

export function useSession() {
  return useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const payload = await App.auth.getSession()
      if (!payload.ok) {
        return null
      }
      return payload.data
    },
    retry: 1,
    // session doesn't go stale automatically
    staleTime: Infinity,
  })
}
