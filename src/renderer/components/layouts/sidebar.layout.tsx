import type { ReactNode } from 'react'
import { cn } from 'renderer/lib/utils'
import { SidebarProvider } from '../ui/sidebar'
import { Sidebar } from '../widgets/sidebar'

export function SidebarLayout({
  children,
  className,
}: {
  children?: ReactNode
  className?: string
}) {
  return (
    <SidebarProvider>
      <Sidebar />
      <main className={cn('w-full px-8 py-6', className)}>{children}</main>
    </SidebarProvider>
  )
}
