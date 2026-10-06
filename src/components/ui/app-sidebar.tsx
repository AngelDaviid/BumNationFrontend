"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Package, CreditCard, ChevronRight, FlaskConical, ClipboardList, Tags } from "lucide-react";
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
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { NavUser } from "./nav-user";
import type { LucideIcon } from "lucide-react";

interface NavItem {
  label: string;
  icon: LucideIcon;
  href?: string;
  items?: { label: string; href: string }[];
}

const navItems: NavItem[] = [
  { label: "Resumen", href: "/admin", icon: LayoutGrid },
  {
    label: "Productos",
    icon: Package,
    items: [
      { label: "Ver productos", href: "/admin/productos" },
    ],
  },
  { label: "Categorías", href: "/admin/categorias", icon: Tags },
  { label: "Membresías y pagos", href: "/admin/pagos", icon: CreditCard },
  { label: "Órdenes", href: "/admin/ordenes", icon: ClipboardList },
  ...(process.env.NODE_ENV !== "production"
    ? [{ label: "UI Test", href: "/admin/ui-test", icon: FlaskConical }]
    : []),
];

export function AppSidebar() {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();

  const closeOnMobile = () => {
    if (isMobile) setOpenMobile(false);
  };

  return (
    <Sidebar
      variant="inset"
      collapsible="icon"
      className="bg-black text-white border-none **:data-[sidebar=sidebar]:bg-black"
    >
      <SidebarHeader>
        <div className="flex items-center justify-center gap-2">
          <Link href="/" onClick={closeOnMobile}>
            <Image src="/Logo.webp" alt="BN Performance" width={100} height={100} />
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
                            ? "border-neon bg-zinc-900 text-neon hover:bg-zinc-900 hover:text-neon"
                            : "border-transparent text-zinc-400 hover:bg-zinc-900 hover:text-white"
                        }`}
                      >
                        <Link href={item.href!} onClick={closeOnMobile} className="flex items-center gap-2">
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
                              ? "border-neon text-neon hover:bg-zinc-900 hover:text-neon"
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
                                      ? "text-neon hover:text-neon"
                                      : "text-zinc-400 hover:text-white"
                                  }`}
                                >
                                  <Link href={sub.href} onClick={closeOnMobile}>{sub.label}</Link>
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