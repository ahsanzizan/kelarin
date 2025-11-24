import { CalendarClock, Hourglass } from 'lucide-react'
import type { CSSProperties, ReactNode } from 'react'
import { cn } from 'renderer/lib/utils'
import { Item, ItemContent, ItemTitle } from '../ui/item'

const TITLE = 'Your profile has been verified. dasdasdasd as dasd ad as'

export function TaskItem({
  detailed,
  className,
  style,
}: {
  detailed?: boolean
  className?: string
  style?: CSSProperties
}) {
  return (
    <Item
      asChild
      className={cn(
        'bg-white/5 w-full',
        className,
        detailed ? 'hover:bg-white/10' : ''
      )}
      size="sm"
      style={style}
      variant="default"
    >
      <button
        className={'hover:cursor-pointer'}
        onClick={() => {
          // navigate("");
        }}
        type="button"
      >
        <ItemContent>
          <ItemTitle className="w-full flex items-center justify-between">
            <p className="line-clamp-1 text-left">{TITLE}</p>
            {!detailed && <p className="text-white/50">00:10</p>}
          </ItemTitle>
        </ItemContent>
        {detailed && (
          <div className="flex w-full items-center justify-between text-neutral-400">
            <TaskOrnament>
              <CalendarClock size={11} /> 10min
            </TaskOrnament>
            <TaskOrnament>
              <Hourglass size={11} /> 1min
            </TaskOrnament>
          </div>
        )}
      </button>
    </Item>
  )
}

function TaskOrnament({ children }: { children?: ReactNode }) {
  return <p className="flex items-center text-xs">{children}</p>
}
