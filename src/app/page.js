"use client";

import { useState, useEffect } from "react";
import clsx from "clsx";
import { useTheme } from "next-themes";
import ViewDetails from "@/components/ViewDetails";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomeSearch() {
  const [term, setTerm] = useState("");
  const [results, setResults] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (searched) {
      fetchResults();
    }
  }, [selectedFilter]);

  const fetchResults = async () => {
    setLoading(true);
    const queryParam = term ? `query=${term}&filter=${selectedFilter}` : `filter=${selectedFilter}`;
    const res = await fetch(`/api/search?${queryParam}`);
    const data = await res.json();
    setResults(data.results || []);
    setLoading(false);
  };

  const handleSearch = () => {
    setSearched(true);
    fetchResults();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 w-full">
      <h1 className="text-center text-2xl font-bold mb-6">Homepage</h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Filtros */}
        <div className={clsx(
          "md:w-1/4 w-full rounded shadow",
          theme === "dark" ? "bg-gray-900 text-white border border-[#06f388]" : "bg-gray-100 text-black border border-gray-200"
        )}>
          <div className="p-4">
            <h3 className="font-bold mb-2">FILTROS</h3>
            <div className="mb-4">
              <p className="font-semibold">Mostrar resultados para:</p>
              {[
                { label: "Todas", value: "all" },
                { label: "Empresa", value: "empresa" },
                { label: "Producto o servicio", value: "producto" },
              ].map(({ label, value }) => (
                <label key={value} className="block">
                  <input
                    type="radio"
                    name="filter"
                    value={value}
                    checked={selectedFilter === value}
                    onChange={() => {
                      setSelectedFilter(value);
                      setSearched(true);
                    }}
                  /> {label}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Buscador y Resultados */}
        <div className="flex-1">
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              className="border p-2 rounded w-full text-black"
              placeholder="Buscar empresa o producto"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Buscar
            </button>
          </div>

          {/* Detalle activo */}
          {selectedItem && (
            <ViewDetails item={selectedItem} onBack={() => setSelectedItem(null)} />
          )}

          {!selectedItem && (
            <div className="space-y-4">
              {loading ? (
                <Skeleton className="w-full h-40 rounded-md" />
              ) : searched ? (
                results.length > 0 ? (
                  results.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedItem(item)}
                      className={clsx(
                        "border p-4 rounded shadow cursor-pointer",
                        theme === "dark" ? "bg-gray-800 text-white border-[#06f388]" : "bg-white text-black border-gray-200"
                      )}
                    >
                      {item.type === "empresa" ? (
                        <>
                          <h3 className="font-bold">{item.companyName}</h3>
                          <p>{item.address}</p>
                          <p>Tel: {item.phone || "No disponible"}</p>
                          <p>WhatsApp: {item.whatsapp || "No disponible"}</p>
                          <p>Email: {item.email || "No disponible"}</p>
                          {item.website && (
                            <p>
                              Website: <a href={`https://${item.website}`} className="text-blue-500 underline">{item.website}</a>
                            </p>
                          )}
                        </>
                      ) : (
                        <>
                          <h3 className="font-bold">{item.productName}</h3>
                          {item.imageUrl && <img src={item.imageUrl} alt={item.productName} className="h-32 object-contain my-2" />}
                          <p>{item.description}</p>
                          <p className="font-semibold">Precio: ${item.price}</p>
                        </>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-600">No se encontraron resultados.</p>
                )
              ) : (
                <p className="text-center text-gray-600">Realiza una búsqueda para ver resultados.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

