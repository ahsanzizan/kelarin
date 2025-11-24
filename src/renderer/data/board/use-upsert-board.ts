import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BoardSchema } from "shared/validations/board";

const { App } = window;

export function useUpsertBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: BoardSchema) => {
      const payload = await App.boards.upsert(values);

      if (!payload.ok) throw new Error(payload.error);
      return payload.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    },
  });
}
