"use client";

import { useTheme } from "next-themes";
import clsx from "clsx";

export default function Loader({ text = "Cargando..." }) {
  const { theme } = useTheme();

  return (
    <div className="flex flex-col items-center justify-center h-80 w-full gap-4 animate-fade-in mx-auto">
      <div className="relative w-16 h-16">
        <div className={clsx(
          "absolute inset-0 rounded-full border-4 border-t-transparent animate-spin",
          theme === "dark"
            ? "border-[#06f388]"
            : "border-[#292554]"
        )} />
      </div>
      <p className={clsx(
        "text-lg font-medium",
        theme === "dark" ? "text-[#06f388]" : "text-[#292554]"
      )}>
        {text}
      </p>
    </div>
  );
}
