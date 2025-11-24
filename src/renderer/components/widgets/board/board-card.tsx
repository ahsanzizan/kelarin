import { CheckCircle2, EllipsisVertical, Expand, Plus } from "lucide-react";
import { Button } from "renderer/components/ui/button";
import { BoardWithTasks } from "shared/types";
import { TaskItem } from "../task/task";

const OPACITY = ["100", "50", "20"];

export function BoardCard({ board }: { board: BoardWithTasks }) {
  const { tasks } = board;

  return (
    <div className="group w-full relative bg-secondary hover:border-white/50 transition-all duration-300 border border-white/15 rounded-lg">
      <div className="w-full flex items-center justify-between pt-4 px-4">
        <div className="flex items-center gap-x-3">
          <span className="size-6 text-sm bg-white rounded text-black flex items-center justify-center font-bold">
            M
          </span>
          <h2 className="text-sm font-bold text-white">Main</h2>
        </div>
        <Button className="text-white/50" size={"icon-sm"} variant={"ghost"}>
          <EllipsisVertical />
        </Button>
      </div>
      <button
        className="hover:cursor-pointer pb-4 w-full px-4 pt-6 block"
        type="button"
      >
        <div className="relative h-full min-h-[200px] group-hover:opacity-60 transition-opacity duration-300">
          {tasks.length > 0 ? (
            <ul className="flex flex-col w-full h-full gap-y-2 mb-12">
              {tasks.map((task, index) => (
                <li key={index}>
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
          <span>3 Pending</span>
          <span>Est: 10min</span>
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

export function NewBoardCard() {
  return (
    <button className="block w-full hover:cursor-pointer group relative bg-secondary/40 border-dashed hover:border-white/50 hover:border-solid transition-all duration-300 border-2 border-white/15 rounded-lg h-full min-h-[306px]">
      <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
        <div className="flex items-center flex-col justify-center text-white/50 group-hover:text-white transition-all duration-300">
          <Plus className="mb-9" size={32} />
          <h2 className="font-bold uppercase">New Board</h2>
        </div>
      </div>
    </button>
  );
}
