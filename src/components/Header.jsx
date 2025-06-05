"use client";

import { useState } from "react";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useTheme } from "next-themes";
import ThemeToggle from "@/components/ThemeToggle";
import Image from "next/image";
import clsx from "clsx";
import Link from "next/link";

export default function Header() {
  const [open, setOpen] = useState(false);
  const { theme } = useTheme();

  return (
    <header
      className={clsx(
        "fixed top-0 inset-x-0 z-50 h-[80px] flex items-center justify-between px-6 transition-colors",
        theme === "dark" ? "bg-[#292554] text-white" : "bg-gray-300 text-black"
      )}
    >
      {/* Logo + Marca */}
      <div className="flex items-center gap-3">
        <Image
          src="/assets/logo.png"
          alt="Logo"
          width={50}
          height={50}
          className="rounded-full"
        />
        <span className="text-xl font-semibold tracking-tight">La Citadel</span>
      </div>

      {/* Navegación escritorio */}
      <nav className="hidden sm:flex items-center gap-6 text-sm font-medium">
        <Link
          href="/login"
          className={clsx(
            "hover:underline",
            theme === "dark" ? "text-[#06f388]" : "text-[#292554]"
          )}
        >
          Ingresa
        </Link>
        <Link
          href="/register"
          className={clsx(
            "hover:underline",
            theme === "dark" ? "text-[#06f388]" : "text-[#292554]"
          )}
        >
          Si sos Mayorista, Crea tu cuenta
        </Link>
        <Link
          href="#"
          className={clsx(
            "hover:underline",
            theme === "dark" ? "text-[#06f388]" : "text-[#292554]"
          )}
        >
          Link
        </Link>
      </nav>

      {/* Toggle + Menú móvil */}
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className="block sm:hidden p-2 rounded-md bg-gray-200 dark:bg-gray-600">
            <Menu className="h-6 w-6 text-black dark:text-white" />
          </SheetTrigger>
          <SheetContent
            side="left"
            className={clsx(
              "pt-10",
              theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"
            )}
          >
            <ul className="flex flex-col gap-4 text-lg px-4">
              <li><Link href="/" onClick={() => setOpen(false)}>Inicio</Link></li>
              <li><Link href="/register" onClick={() => setOpen(false)}>Crear cuenta</Link></li>
              <li><Link href="/login" onClick={() => setOpen(false)}>Ingresar</Link></li>
            </ul>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
