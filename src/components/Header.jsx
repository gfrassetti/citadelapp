"use client";

import { useState } from "react";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useTheme } from "next-themes";
import ThemeToggle from "@/components/ThemeToggle"
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import clsx from "clsx";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"


import Link from "next/link";

export default function Header() {
  const [open, setOpen] = useState(false);
  const { theme } = useTheme();

  return (
      <header
        className={clsx(
          "flex items-center justify-between transition-colors fixed w-full top-0",
          theme === "dark" ? "bg-[#292554] text-white" : "bg-gray-300 text-black"
        )}
      >
      <Image src="/assets/logo.png" alt="Logo de Mi App" width={80} height={80} className="mb-2" />
      <span className="text-2xl font-bold text-gray-800"></span>
      <Input type="search" id="search" placeholder="Buscar" className="border border-solid border-white mx-4 w-auto sm:w-72" />
      <div className="hidden items-center gap-4 px-6 w-auto sm:flex">
      <Link href="/login" className={clsx("hover:text-[#c646a2] transition-colors" , theme === "dark" ? "text-[#06f388]" : "text-[#292554]")}>Ingresa</Link>
      <Link href="/register" className={clsx("hover:text-[#c646a2] transition-colors" , theme === "dark" ? "text-[#06f388]" : "text-[#292554]")}>Si sos Mayorista, Crea tu cuenta</Link>
      <Link className={clsx("hover:text-[#c646a2] transition-colors" , theme === "dark" ? "text-[#06f388]" : "text-[#292554]")} href="">Link</Link>
      </div>
      <div className="flex items-center gap-4 px-2 sm:px-8 w-auto">
        {/* Botón de cambio de tema */}
        <ThemeToggle />  
        {/* Menú Hamburguesa */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className="p-2 rounded-md transition-colors bg-gray-300 dark:bg-gray-600 block sm:hidden">
            <Menu className="h-6 w-6 text-black dark:text-white" />
          </SheetTrigger>
          <SheetContent
            side="left"
            className={clsx(
              "transition-colors",
              theme === "dark" ? "bg-gray-900 text-[#5deb5a]" : "bg-white text-black"
            )}
          >
            <ul className="flex flex-col gap-4">
              <li><a href="/" onClick={() => setOpen(false)}>Inicio</a></li>
              <li><a href="/about" onClick={() => setOpen(false)}>Sobre Nosotros</a></li>
              <li><a href="/contact" onClick={() => setOpen(false)}>Contacto</a></li>
            </ul>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
