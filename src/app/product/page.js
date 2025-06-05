"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function HomeSearch() {
  const [term, setTerm] = useState("");
  const [results, setResults] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searched, setSearched] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (searched) fetchResults();
  }, [selectedFilter]);

  const fetchResults = async () => {
    const queryParam = term ? `query=${term}&filter=${selectedFilter}` : `filter=${selectedFilter}`;
    const res = await fetch(`/api/search?${queryParam}`);
    const data = await res.json();
    setResults(data.results || []);
    setSearched(true);
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

  const handleItemClick = (item) => {
    const url = item.type === "empresa" ? `/company?id=${item.id}` : `/product?id=${item.id}`;
    router.push(url);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 w-full">
      <h1 className="text-center text-2xl font-bold mb-6">Homepage</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/4 w-full bg-gray-100 p-4 rounded shadow">
          <h3 className="font-bold mb-2">FILTROS</h3>
          <div className="mb-4">
            <p className="font-semibold">Mostrar resultados para:</p>
            <label className="block">
              <input
                type="radio"
                name="filter"
                value="all"
                checked={selectedFilter === "all"}
                onChange={() => {
                  setSelectedFilter("all");
                  setSearched(true);
                }}
              />
              Todas
            </label>
            <label className="block">
              <input
                type="radio"
                name="filter"
                value="empresa"
                checked={selectedFilter === "empresa"}
                onChange={() => {
                  setSelectedFilter("empresa");
                  setSearched(true);
                }}
              />
              Empresa
            </label>
            <label className="block">
              <input
                type="radio"
                name="filter"
                value="producto"
                checked={selectedFilter === "producto"}
                onChange={() => {
                  setSelectedFilter("producto");
                  setSearched(true);
                }}
              />
              Producto o servicio
            </label>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex gap-2 mb-4">
            <Input
              type="text"
              placeholder="Buscar empresa o producto"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button onClick={handleSearch} className="bg-blue-600 text-white">
              Buscar
            </Button>
          </div>

          <div className="space-y-4">
            {searched ? (
              results.length > 0 ? (
                results.map((item, index) => (
                  <div
                    key={index}
                    className="border p-4 rounded shadow cursor-pointer hover:bg-gray-50"
                    onClick={() => handleItemClick(item)}
                  >
                    {item.type === "empresa" ? (
                      <div className="flex gap-4 items-center">
                        {item.imageUrl && <Avatar src={item.imageUrl} alt={item.companyName} />}
                        <div>
                          <h3 className="font-bold">{item.companyName}</h3>
                          <p>{item.address}</p>
                        </div>
                      </div>
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
        </div>
      </div>
    </div>
  );
}
