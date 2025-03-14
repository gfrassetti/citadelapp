"use client";
import { useState } from "react";

export default function Filters({ setFilter }) {
  const [selectedFilter, setSelectedFilter] = useState("all");

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    setFilter(filter);
  };

  return (
    <div className="bg-gray-100 p-4 rounded-md w-64">
      <h2 className="font-bold text-lg mb-2">FILTROS</h2>
      <div className="space-y-2">
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            name="filter"
            value="empresa"
            checked={selectedFilter === "empresa"}
            onChange={() => handleFilterChange("empresa")}
          />
          <span>Empresa</span>
        </label>

        <label className="flex items-center space-x-2">
          <input
            type="radio"
            name="filter"
            value="rubro"
            checked={selectedFilter === "rubro"}
            onChange={() => handleFilterChange("rubro")}
          />
          <span>Rubro</span>
        </label>

        <label className="flex items-center space-x-2">
          <input
            type="radio"
            name="filter"
            value="producto"
            checked={selectedFilter === "producto"}
            onChange={() => handleFilterChange("producto")}
          />
          <span>Producto o servicio</span>
        </label>
      </div>
    </div>
  );
}
