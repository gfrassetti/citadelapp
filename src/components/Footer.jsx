"use client";

import { useTheme } from "next-themes";
import Image from "next/image"
import clsx from "clsx";


export default function Footer(){
const { theme } = useTheme();
return (
    <footer className={clsx(
        "flex w-full h-[150px] text-center items-center justify-between transition-colors absolute bottom-0 inset-x-0",
        theme === "dark" ? "bg-[#292554] text-white" : "bg-gray-300 text-black"
      )}>
        <div className={clsx("hover:text-underline text-xl text-center mx-auto" , theme === "dark" ? "text-[#06f388]" : "text-[#292554]")}>Footer</div>
    </footer>
)
}