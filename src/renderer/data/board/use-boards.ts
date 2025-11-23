import { useQuery } from "@tanstack/react-query";

const { App } = window;

export function useBoards() {
  return useQuery({
    queryKey: ["boards"],
    queryFn: () => App.boards.getAll(),
  });
}
