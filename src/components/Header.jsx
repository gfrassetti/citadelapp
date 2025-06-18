"use client";

import { useState } from "react";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useTheme } from "next-themes";
import ThemeToggle from "@/components/ThemeToggle";
import Image from "next/image";
import clsx from "clsx";
import Link from "next/link";
import { FaSignInAlt } from "react-icons/fa";

export default function Header() {
  const [open, setOpen] = useState(false);
  const { theme } = useTheme();

  return (
    <header
      className={clsx(
        "w-full text-white shadow-sm flex flex-col items-center px-0 pt-4 pb-2",
        theme === "dark" ? "bg-[#1f1b34]" : "bg-[#2953D4]"
      )}
    >      <div className="flex w-full mx-auto justify-between items-start px-6 relative">
        {/* Logo + claim */}
        <div className="flex flex-col items-start gap-0">
          <div className="flex items-center gap-4">
            <Image
              src="/assets/logo.png"
              alt="Logo"
              width={130}
              height={64}
              className="h-[100px] w-auto"
              priority
            />
          </div>
          <span className="text-xs font-semibold mt-0 ml-2 tracking-wide">
            TODO LO QUE NECESITÁS, EN UN SOLO LUGAR.
          </span>
        </div>

        {/* Botón INGRESAR solo escritorio */}
        <div class="block justify-items-center">
          <div className="hidden sm:flex flex-col items-end gap-2 mt-2">
            <Link href="/login" className="flex flex-col items-center">
              <div className="bg-[#c646a2] hover:bg-[#131029] transition-colors px-4 py-3 rounded-lg flex flex-col items-center gap-3 shadow font-bold text-white text-[1.05rem] relative">
                <span className="relative text-sm font-normal text-white/90">
                  ¿Ya eres cliente?
                </span>
                <span className="pl-7">
                  <FaSignInAlt className="inline-block mr-2 text-xl -ml-4" />
                  INGRESAR
                </span>
              </div>
            </Link>
          </div>
          <div className="relative w-10 block mt-0 sm:mt-4">
            <ThemeToggle />
          </div>
        </div>
        {/* Menú hamburguesa solo mobile */}
        <div className="flex sm:hidden items-center gap-3">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger className="ml-2 p-2 rounded-md bg-[#fd6d71]">
              <Menu className="h-6 w-6 text-white" />
            </SheetTrigger>
            <SheetContent
              side="left"
              className="pt-10 bg-[#2953D4] text-white"
            >
              <ul className="flex flex-col gap-4 text-lg px-4">
                <li>
                  <Link href="/" onClick={() => setOpen(false)}>
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="#" onClick={() => setOpen(false)}>
                    Quiénes somos
                  </Link>
                </li>
                <li>
                  <Link href="#" onClick={() => setOpen(false)}>
                    Novedades
                  </Link>
                </li>
                <li>
                  <Link href="#" onClick={() => setOpen(false)}>
                    Contacto
                  </Link>
                </li>
                <li>
                  <Link href="#" onClick={() => setOpen(false)}>
                    Cómo comprar
                  </Link>
                </li>
                <li>
                  <Link href="#" onClick={() => setOpen(false)}>
                    Informar pago
                  </Link>
                </li>
                <li>
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="mt-4 font-bold flex items-center gap-2 bg-[#8038e9] px-4 py-3 rounded-lg"
                  >
                    <FaSignInAlt className="inline-block mr-2 text-xl -ml-4" />
                    INGRESAR
                  </Link>
                </li>
              </ul>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Menú nav horizontal */}
      <nav className="w-[90%] mx-auto bg-transparent justify-between mt-4 mb-0 hidden sm:flex">
        <ul className="flex flex-row gap-8 px-8 py-0 max-w-screen-xl font-semibold text-sm sm:text-base tracking-wide">
          <li>
            <Link  className="hover:text-green-400 transition-colors cursor-pointer font-medium" href="/">Home</Link>
          </li>
          <li>
            <Link  className="hover:text-green-400 transition-colors cursor-pointer font-medium" href="#">Quiénes somos</Link>
          </li>
          <li>
            <Link  className="hover:text-green-400 transition-colors cursor-pointer font-medium" href="#">Novedades</Link>
          </li>
          <li>
            <Link  className="hover:text-green-400 transition-colors cursor-pointer font-medium" href="#">Contacto</Link>
          </li>
          <li>
            <Link  className="hover:text-green-400 transition-colors cursor-pointer font-medium" href="#">FAQs</Link>
          </li>
        </ul>
          <Link className="hover:text-green-400 transition-colors cursor-pointer font-medium pr-8"  href="/register">Sos Mayorista? Registrate <strong>acá</strong></Link>
      </nav>
    </header>
  );
}
