"use client";

import { useState, useEffect } from "react";

export default function HomeSearch() {
  const [term, setTerm] = useState("");
  const [results, setResults] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("all");

  useEffect(() => {
    fetchResults();
  }, [selectedFilter]);

  const fetchResults = async () => {
    const queryParam = term ? `query=${term}&filter=${selectedFilter}` : `filter=${selectedFilter}`;
    const res = await fetch(`/api/search?${queryParam}`);
    const data = await res.json();
    setResults(data.results || []);
  };

  const handleSearch = () => {
    fetchResults();
  };

  return (
    <div className="max-w-7xl mx-auto p-4 w-full">
      <h1 className="text-center text-2xl font-bold mb-6">Homepage</h1>
      
      <div className="flex gap-6">
        {/* Filtros */}
        <div className="w-1/4 bg-gray-100 p-4 rounded shadow">
          <h3 className="font-bold mb-2">FILTROS</h3>

          <div className="mb-4">
            <p className="font-semibold">Mostrar resultados para:</p>
            <label className="block">
              <input 
                type="radio" 
                name="filter" 
                value="all" 
                checked={selectedFilter === "all"} 
                onChange={() => setSelectedFilter("all")} 
              />
              Todas
            </label>
            <label className="block">
              <input 
                type="radio" 
                name="filter" 
                value="empresa" 
                checked={selectedFilter === "empresa"} 
                onChange={() => setSelectedFilter("empresa")} 
              />
              Empresa
            </label>
            <label className="block">
              <input 
                type="radio" 
                name="filter" 
                value="producto" 
                checked={selectedFilter === "producto"} 
                onChange={() => setSelectedFilter("producto")} 
              />
              Producto o servicio
            </label>
          </div>
        </div>

        {/* Buscador y Resultados */}
        <div className="flex-1">
          <div className="flex gap-2 mb-4">
            <input 
              type="text"
              className="border p-2 rounded w-full"
              placeholder="Buscar empresa o producto"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
            />
            <button 
              onClick={handleSearch} 
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Buscar
            </button>
          </div>

          {/* Resultados */}
          <div className="space-y-4">
            {results.length > 0 ? (
              results.map((item, index) => (
                <div key={index} className="border p-4 rounded shadow">
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
