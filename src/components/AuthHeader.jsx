"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import clsx from "clsx";
import Link from "next/link";

export default function AuthHeader() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const srcLogo = theme === "dark" ? "/assets/logo_white.png" : "/assets/logo.png"
  const textSecondary = isDark ? "text-gray-300" : "text-gray-700";

  return (
    <header
      className={clsx(
        "flex items-center justify-between px-6 py-2 fixed w-full top-0 z-50 shadow-sm",
        theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-800"
      )}
    >
      <div className="flex flex-col items-center gap-4">
        <Link href="/">
          <Image
            src={srcLogo}
            alt="Logo"
            width={100}
            height={65}
            priority
          />
        </Link>
        <span className={clsx("text-xs font-semibold mt-0 ml-2 tracking-wide", textSecondary)}>
          TODO LO QUE NECESITÁS, EN UN SOLO LUGAR.
        </span>
      </div>
    </header>
  );
}