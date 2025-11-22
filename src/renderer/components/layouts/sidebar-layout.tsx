import type { ReactNode } from 'react'
import { SidebarProvider, SidebarTrigger } from '../ui/sidebar'
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
      <main className={className}>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}
