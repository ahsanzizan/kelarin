import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "../ui/sidebar";

export function Sidebar() {
  return (
    <ShadcnSidebar>
      <SidebarHeader className="pt-6">
        <div className="border-white/10 bg-white/5 p-6 rounded-xl">
          <div className="flex items-end gap-x-2 mb-3">
            <h2 className="text-3xl font-semibold text-white">Kelarin</h2>
            <h3 className="text-sm text-white/60">(v1.0.0)</h3>
          </div>
          <p className="text-sm text-white/60">
            An open-source productivity engine that keeps you moving lightning
            fast.
          </p>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </ShadcnSidebar>
  );
}
