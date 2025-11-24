import { useQuery } from "@tanstack/react-query";

const { App } = window;

export function useBoards() {
  return useQuery({
    queryKey: ["boards"],
    queryFn: async () => {
      const payload = await App.boards.getAll();

      if (!payload.ok) throw new Error(payload.error);
      return payload.data;
    },
  });
}
