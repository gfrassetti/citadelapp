"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import clsx from "clsx";
import Link from "next/link";

export default function AuthHeader() {
  const { theme } = useTheme();

  return (
    <header
      className={clsx(
        "flex items-center justify-between px-6 py-2 fixed w-full top-0 z-50 shadow-sm",
        theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-800"
      )}
    >
      <div className="flex items-center gap-4">
        <Link href="/">
          <button className="text-sm text-blue-600 hover:underline">← Volver al inicio</button>
        </Link>
        <Image src="/assets/logo.png" alt="Logo" width={50} height={50} />
      </div>

      <div className="hidden sm:flex items-center gap-6">
        <Link href="/login" className="text-sm hover:underline">
          ¿Ya tenés cuenta?
        </Link>
        <Link href="/register">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
            Registrarse
          </button>
        </Link>
      </div>
    </header>
  );
}
