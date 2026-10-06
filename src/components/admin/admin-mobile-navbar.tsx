"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { AdminHeaderTitle } from "@/components/admin/admin-header-title";

export function AdminMobileNavbar() {
  const { openMobile, setOpenMobile } = useSidebar();

  return (
    <nav className="fixed top-4 left-1/2 z-40 flex w-[92%] -translate-x-1/2 items-center justify-between gap-3 rounded-2xl bg-zinc-900 px-4 py-3 shadow-xl md:hidden">
      <Link href="/admin" onClick={() => setOpenMobile(false)} className="shrink-0">
        <Image src="/Logo.webp" alt="Bum Nation" width={80} height={80} className="object-contain" />
      </Link>

      <div className="min-w-0 flex-1 text-center [&>span]:text-zinc-200">
        <AdminHeaderTitle />
      </div>

      <button
        type="button"
        onClick={() => setOpenMobile(!openMobile)}
        aria-label={openMobile ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={openMobile}
        className="flex shrink-0 items-center justify-center text-zinc-300 transition-colors hover:text-white"
      >
        {openMobile ? <X size={24} /> : <Menu size={24} />}
      </button>
    </nav>
  );
}
