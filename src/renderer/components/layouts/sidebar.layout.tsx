import type { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { Sidebar } from "../widgets/sidebar";
import { cn } from "renderer/lib/utils";

export function SidebarLayout({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <SidebarProvider>
      <Sidebar />
      <main className={cn("w-full px-8 py-6", className)}>{children}</main>
    </SidebarProvider>
  );
}
