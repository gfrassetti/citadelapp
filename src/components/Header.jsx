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

  // Helpers para clases globales y por tema
  const isDark = theme === "dark";
  const textMain = isDark ? "text-white" : "text-black";
  const textSecondary = isDark ? "text-gray-300" : "text-gray-700";
  const navHover = isDark ? "hover:text-green-400" : "hover:text-primary-dark";
  const bgMain = isDark ? "bg-[#1f1b34]" : "bg-omalmd";

  return (
    <header
      className={clsx(
        "w-full shadow-sm flex flex-col items-center px-0 pt-4 pb-2",
        bgMain,
        textMain
      )}
    >
      <div className="flex w-full mx-auto justify-between items-start px-6 relative">
        {/* Logo + claim */}
        <div className="flex flex-col items-start gap-0">
          <div className="flex items-center gap-4">
            <Image
              src="/assets/logo.png"
              alt="Logo"
              width={170}
              height={85}
              priority
            />
          </div>
          <span className={clsx("text-xs font-semibold mt-0 ml-2 tracking-wide", textSecondary)}>
            TODO LO QUE NECESITÁS, EN UN SOLO LUGAR.
          </span>
        </div>

        {/* Botón INGRESAR solo escritorio */}
        <div className="block justify-items-center">
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
            <SheetTrigger className={clsx("ml-2 p-2 rounded-md", isDark ? "bg-[#8038e9]" : "bg-[#fd6d71]")}>
              <Menu className={clsx("h-6 w-6", textMain)} />
            </SheetTrigger>
            <SheetContent
              side="left"
              className={clsx(
                "pt-10",
                isDark ? "bg-[#1f1b34] text-white" : "bg-[#2953D4] text-black"
              )}
            >
              <ul className="flex flex-col gap-4 text-lg px-4">
                <li>
                  <Link href="/" onClick={() => setOpen(false)} className={clsx(textMain, navHover)}>
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="#" onClick={() => setOpen(false)} className={clsx(textMain, navHover)}>
                    Quiénes somos
                  </Link>
                </li>
                <li>
                  <Link href="#" onClick={() => setOpen(false)} className={clsx(textMain, navHover)}>
                    Novedades
                  </Link>
                </li>
                <li>
                  <Link href="#" onClick={() => setOpen(false)} className={clsx(textMain, navHover)}>
                    Contacto
                  </Link>
                </li>
                <li>
                  <Link href="#" onClick={() => setOpen(false)} className={clsx(textMain, navHover)}>
                    Cómo comprar
                  </Link>
                </li>
                <li>
                  <Link href="#" onClick={() => setOpen(false)} className={clsx(textMain, navHover)}>
                    Informar pago
                  </Link>
                </li>
                <li>
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className={clsx(
                      "mt-4 font-bold flex items-center gap-2 px-4 py-3 rounded-lg",
                      isDark ? "bg-[#c646a2] text-white" : "bg-[#8038e9] text-white"
                    )}
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
      <nav className={clsx("w-[90%] mx-auto bg-transparent justify-between mt-4 mb-0 hidden sm:flex desktop-menu", textMain)}>
        <ul className="flex flex-row gap-8 px-8 py-0 max-w-screen-xl font-semibold text-sm sm:text-base tracking-wide">
          <li>
            <Link className={clsx("transition-colors cursor-pointer font-medium", navHover, textMain)} href="/">Home</Link>
          </li>
          <li>
            <Link className={clsx("transition-colors cursor-pointer font-medium", navHover, textMain)} href="#">Quiénes somos</Link>
          </li>
          <li>
            <Link className={clsx("transition-colors cursor-pointer font-medium", navHover, textMain)} href="#">Novedades</Link>
          </li>
          <li>
            <Link className={clsx("transition-colors cursor-pointer font-medium", navHover, textMain)} href="#">Contacto</Link>
          </li>
          <li>
            <Link className={clsx("transition-colors cursor-pointer font-medium", navHover, textMain)} href="#">FAQs</Link>
          </li>
        </ul>
        <Link
          className={clsx("transition-colors cursor-pointer font-medium pr-8", navHover, textMain)}
          href="/register"
        >
          Sos Mayorista? Registrate <strong>acá</strong>
        </Link>
      </nav>
    </header>
  );
}
