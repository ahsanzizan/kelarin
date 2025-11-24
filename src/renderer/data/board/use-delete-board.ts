import { useMutation, useQueryClient } from "@tanstack/react-query";

const { App } = window;

export function useDeleteBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const payload = await App.boards.delete(id);

      if (!payload.ok) throw new Error(payload.error);
      return payload.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    },
  });
}
