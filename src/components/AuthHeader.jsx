"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import clsx from "clsx";
import Link from "next/link";

export default function AuthHeader() {
  const { theme } = useTheme();
  const srcLogo = theme === "dark" ? "/assets/logo-white.png" : "/assets/logo.png"

  return (
    <header
      className={clsx(
        "flex items-center justify-between px-6 py-2 fixed w-full top-0 z-50 shadow-sm",
        theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-800"
      )}
    >
      <div className="flex items-center gap-4">
        <Link href="/">
          <button
            className={clsx(
              "text-sm hover:underline",
              theme === "dark" ? "text-white" : "text-black"
            )}
          >
            ← Volver al inicio
          </button>
        </Link>
        <Image
          src={srcLogo}
          alt="Logo"
          width={170}
          height={85}
          priority
        />
      </div>
      <div className="hidden sm:flex items-center gap-6">
        <Link href="/register">
          <button
            className={clsx(
              "px-4 py-2 rounded transition",
              theme === "dark" ? "btn-secondary" : "btn text-white"
            )}
          >
            Registrarse
          </button>
        </Link>
      </div>
    </header>
  );
}
