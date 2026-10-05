import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { AdminHeaderTitle } from "@/components/admin/admin-header-title";
import { AdminMobileNavbar } from "@/components/admin/admin-mobile-navbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider
        style={
          {
            "--sidebar-width": "20rem",
            "--sidebar-width-mobile": "20rem",
          } as React.CSSProperties
  }
    > 
      <AppSidebar />
      <SidebarInset className="min-w-0">
        <AdminMobileNavbar />
        <header className="sticky top-0 z-30 hidden h-14 items-center gap-2 border-b border-zinc-200 bg-white/90 px-4 backdrop-blur md:flex">
          <SidebarTrigger />
          <AdminHeaderTitle />
        </header>
        <main className="min-w-0 flex-1 bg-zinc-50 px-3 pt-28 pb-3 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}