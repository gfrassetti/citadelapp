"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export default function Filters({ selectedFilter, setSelectedFilter }) {
  return (
    <div className="w-full md:w-1/4 bg-gray-50 p-6 rounded-lg shadow-md border">
      <h3 className="text-lg font-bold mb-4 text-gray-800">Filtros</h3>
      <p className="text-sm text-muted-foreground mb-2">Mostrar resultados para:</p>

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
