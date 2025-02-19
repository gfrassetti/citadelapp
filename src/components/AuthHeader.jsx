"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import clsx from "clsx";


export default function AuthHeader() {
  const { theme } = useTheme();

  return (
      <header
        className={clsx(
          "flex items-center justify-between transition-colors fixed w-full top-0",
          theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-200 text-black"
        )}
      >
      <Image src="/assets/logo.png" alt="Logo de Mi App" width={80} height={80} className="mb-2" />
      <span className="text-2xl font-bold text-gray-800"></span>
      <div className="hidden items-center gap-4 px-6 w-auto sm:flex">
      </div>
    </header>
  );
}
