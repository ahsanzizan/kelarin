import { useMutation, useQueryClient } from '@tanstack/react-query'

const { App } = window

export function useAuth() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (values: {
      username: string
      password: string
      mode: 'login' | 'register'
    }) => {
      const payload =
        values.mode === 'login'
          ? await App.auth.login(values)
          : await App.auth.register(values)

      if (!payload.ok) throw new Error(payload.error)
      return payload.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session'] })
    },
  })
}
