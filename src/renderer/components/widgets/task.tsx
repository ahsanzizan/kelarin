import { CalendarClock, Circle, Hourglass } from "lucide-react";
import { ReactNode } from "react";
import { Item, ItemContent, ItemMedia, ItemTitle } from "../ui/item";

export function TaskItem() {
  return (
    <Item
      variant="default"
      size="sm"
      className="bg-white/5 hover:bg-white/10"
      asChild
    >
      <button
        type="button"
        onClick={() => {
          // navigate("");
        }}
      >
        <ItemContent>
          <ItemTitle className="">Your profile has been verified.</ItemTitle>
        </ItemContent>
        <div className="flex w-full items-center justify-between text-neutral-400">
          <TaskOrnament>
            <CalendarClock size={11} /> 10min
          </TaskOrnament>
          <TaskOrnament>
            <Hourglass size={11} /> 1min
          </TaskOrnament>
        </div>
      </button>
    </Item>
  );
}

function TaskOrnament({ children }: { children?: ReactNode }) {
  return <p className="flex items-center text-xs">{children}</p>;
}
