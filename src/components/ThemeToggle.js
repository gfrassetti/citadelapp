"use client";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"



export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <>
    <div className="border border-1 border-solid border-white rounded-3xl p-0 box-content h-[20px]">
      <Switch
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      >
      </Switch>
      </div>
      <Label htmlFor="airplane-mode"></Label>
      </>
  )
}