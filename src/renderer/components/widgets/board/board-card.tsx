import {
  CheckCircle2,
  Copy,
  EllipsisVertical,
  Expand,
  Trash,
} from "lucide-react";
import { Button } from "renderer/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "renderer/components/ui/popover";
import { useDeleteBoard } from "renderer/data/board/use-delete-board";
import { BoardWithTasks } from "shared/types";
import { toast } from "sonner";
import { TaskItem } from "../task/task";
import { UpdateBoardButton } from "./update-board-button";

const OPACITY = ["100", "50", "20"];

export function BoardCard({ board }: { board: BoardWithTasks }) {
  const { tasks } = board;
  const { mutate: deleteBoard } = useDeleteBoard();

  return (
    <div className="group w-full relative bg-secondary hover:border-white/50 transition-all duration-300 border border-white/15 rounded-lg">
      <div className="w-full flex items-center justify-between pt-4 px-4">
        <div className="flex items-center gap-x-3">
          <span
            className="size-6 text-sm rounded text-black flex items-center justify-center font-bold uppercase"
            style={{ backgroundColor: board.color }}
          >
            {board.title[0]}
          </span>
          <h2 className="text-sm font-bold text-white">{board.title}</h2>
        </div>
        <Popover>
          <PopoverTrigger>
            <Button
              className="text-white/50"
              size={"icon-sm"}
              variant={"ghost"}
            >
              <EllipsisVertical />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="max-w-36">
            <div className="flex flex-col">
              <UpdateBoardButton board={board} />
              <Button
                variant={"ghost"}
                size={"sm"}
                className="rounded justify-start"
              >
                <Copy /> Duplicate
              </Button>
              <Button
                variant={"ghost"}
                size={"sm"}
                className="rounded justify-start"
                onClick={() => {
                  deleteBoard(board.id, {
                    onSuccess: () => {
                      toast.success(`Board "${board.title}" has been deleted`);
                    },
                    onError: (reqErr) => {
                      toast.error(`Failed to delete board ${board.title}`, {
                        description: reqErr.message,
                      });
                    },
                  });
                }}
              >
                <Trash /> Delete
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <button
        className="hover:cursor-pointer pb-4 w-full px-4 pt-6 block"
        type="button"
      >
        <div className="relative h-full min-h-[200px] group-hover:opacity-60 transition-opacity duration-300">
          {tasks.length > 0 ? (
            <ul className="flex flex-col w-full h-full gap-y-2 mb-12">
              {tasks.map((task, index) => (
                <li key={task.id}>
                  <TaskItem style={{ opacity: OPACITY[index] + "%" }} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
              <div className="flex items-center justify-center flex-col">
                <CheckCircle2 className="mb-4" size={32} />
                <p className="uppercase font-bold text-xs">
                  Board's Empty
                  <br />
                  All Clear
                </p>
              </div>
            </div>
          )}
        </div>
        <div className="w-full flex items-center justify-between text-xs font-bold text-white/60">
          <span>{board.tasks.length} Pending</span>
          {board.tasks.length > 0 && (
            <span>
              Est:{" "}
              {board.tasks.reduce(
                (totalMinutes, task) => totalMinutes + task.estimatedDuration,
                0
              )}
              min
            </span>
          )}
        </div>
      </button>
      <div className="pointer-events-none bg-foreground px-8 py-2 rounded-full group-hover:opacity-100 opacity-0 transition-all duration-300 absolute left-1/2 -translate-x-1/2 top-1/2 group-hover:-translate-y-1/2">
        <p className="text-background text-sm font-semibold flex items-center gap-2">
          <Expand size={16} /> Open
        </p>
      </div>
    </div>
  );
}
