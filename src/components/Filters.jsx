"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useTheme } from "next-themes";
import clsx from "clsx";

export default function Filters({ selectedFilter, setSelectedFilter }) {
  const { theme } = useTheme();

  return (
    <div
      className={clsx(
        "w-full md:w-1/4 p-6 rounded-lg shadow-md border",
        theme === "dark"
          ? "bg-gray-800 text-white"
          : "bg-gray-50 text-gray-800"
      )}
    >
      <h3 className="text-lg font-bold mb-4">Filtros</h3>
      <p className={clsx(
        "text-sm mb-2",
        theme === "dark" ? "text-gray-300" : "text-muted-foreground"
      )}>
        Mostrar resultados para:
      </p>

      <RadioGroup
        value={selectedFilter}
        onValueChange={setSelectedFilter}
        className="space-y-3"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="all" id="all" />
          <Label htmlFor="all">Todas</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="empresa" id="empresa" />
          <Label htmlFor="empresa">Empresa</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="producto" id="producto" />
          <Label htmlFor="producto">Producto o servicio</Label>
        </div>
      </RadioGroup>
    </div>
  );
}
