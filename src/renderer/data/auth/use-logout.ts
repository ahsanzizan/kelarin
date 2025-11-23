import { useMutation, useQueryClient } from '@tanstack/react-query'

const { App } = window

export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const payload = await App.auth.logout()
      if (!payload.ok || !payload.data) {
        throw new Error(payload.error ?? 'Logout failed')
      }
      return payload.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session'] })
    },
  })
}
