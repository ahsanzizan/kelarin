import { CalendarClock, Hourglass } from 'lucide-react'
import type { ReactNode } from 'react'
import { Item, ItemContent, ItemTitle } from '../ui/item'

export function TaskItem() {
  return (
    <Item
      asChild
      className="bg-white/5 hover:bg-white/10"
      size="sm"
      variant="default"
    >
      <button
        onClick={() => {
          // navigate("");
        }}
        type="button"
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
  )
}

function TaskOrnament({ children }: { children?: ReactNode }) {
  return <p className="flex items-center text-xs">{children}</p>
}
