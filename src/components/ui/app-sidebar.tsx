"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Package, CreditCard, ChevronRight } from "lucide-react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { NavUser } from "./nav-user";

const navItems = [
  { label: "Resumen", href: "/admin", icon: LayoutGrid },
  {
    label: "Productos",
    icon: Package,
    items: [
      { label: "Ver productos", href: "/admin/productos" },
      { label: "Agregar producto", href: "/admin/productos/agregar" },
      { label: "Editar producto", href: "/admin/productos/editar" },
    ],
  },
  { label: "Pagos", href: "/admin/pagos", icon: CreditCard },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar
      variant="inset"
      collapsible="icon"
      className="bg-black text-white border-none **:data-[sidebar=sidebar]:bg-black"
    >
      <SidebarHeader>
        <div className="flex items-center justify-center gap-2">
          <Link href="/">
            <Image src="/Logo.svg" alt="BN Performance" width={100} height={100} />
          </Link>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;

                if (!item.items) {
                  const active = pathname === item.href;
                  return (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton
                        asChild
                        tooltip={item.label}
                        className={`rounded-md border-l-2 ${
                          active
                            ? "border-[#6BFF3C] bg-zinc-900 text-[#6BFF3C] hover:bg-zinc-900 hover:text-[#6BFF3C]"
                            : "border-transparent text-zinc-400 hover:bg-zinc-900 hover:text-white"
                        }`}
                      >
                        <Link href={item.href!} className="flex items-center gap-2">
                          <Icon size={16} />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                }

                const isParentActive = item.items.some(
                  (sub) => sub.href === pathname
                );

                return (
                  <Collapsible
                    key={item.label}
                    asChild
                    defaultOpen={isParentActive}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          tooltip={item.label}
                          className={`rounded-md border-l-2 ${
                            isParentActive
                              ? "border-[#6BFF3C] text-[#6BFF3C] hover:bg-zinc-900 hover:text-[#6BFF3C]"
                              : "border-transparent text-zinc-400 hover:bg-zinc-900 hover:text-white"
                          }`}
                        >
                          <Icon size={16} />
                          <span>{item.label}</span>
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <SidebarMenuSub className="border-zinc-800">
                          {item.items.map((sub) => {
                            const active = pathname === sub.href;
                            return (
                              <SidebarMenuSubItem key={sub.href}>
                                <SidebarMenuSubButton
                                  asChild
                                  className={`hover:bg-zinc-900 ${
                                    active
                                      ? "text-[#6BFF3C] hover:text-[#6BFF3C]"
                                      : "text-zinc-400 hover:text-white"
                                  }`}
                                >
                                  <Link href={sub.href}>{sub.label}</Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            );
                          })}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}