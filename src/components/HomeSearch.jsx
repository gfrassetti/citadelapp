"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import clsx from "clsx";
import Loader from "@/components/Loader";
import Filters from "@/components/Filters";

export default function HomeSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme } = useTheme();

  const [term, setTerm] = useState("");
  const [results, setResults] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const query = searchParams.get("query") || "";
    const filter = searchParams.get("filter") || "all";
    if (query || filter) {
      setTerm(query);
      setSelectedFilter(filter);
      fetchResults(query, filter);
    }
  }, []);

  const fetchResults = async (queryValue, filterValue) => {
    setLoading(true);
    try {
      const queryParam = queryValue
        ? `query=${queryValue}&filter=${filterValue}`
        : `filter=${filterValue}`;
      const res = await fetch(`/api/search?${queryParam}`);
      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      console.error("Error al buscar:", err);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  const handleSearch = () => {
    setSearched(true);
    router.push(`/?query=${term}&filter=${selectedFilter}`);
    fetchResults(term, selectedFilter);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 w-full h-max pt-[80px]">
      <h1 className="text-center text-2xl font-bold mb-6"></h1>

      <div className="flex flex-col md:flex-row gap-6">
        <Filters selectedFilter={selectedFilter} setSelectedFilter={setSelectedFilter} />
        <div className="flex-1">
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              className="border p-2 rounded w-full"
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

          <div className="space-y-4">
            {loading ? (
              <Loader text="Cargando..." />
            ) : searched ? (
              results.length > 0 ? (
                results.map((item) => (
                  <div
                    key={item.id}
                    className={clsx(
                      "border p-4 rounded shadow cursor-pointer hover:shadow-md transition",
                      theme === "dark"
                        ? "bg-gray-800 text-white border-[#06f388]"
                        : "bg-white text-black border-gray-200"
                    )}
                    onClick={() =>
                      item.type === "empresa"
                        ? router.push(`/company?id=${item.id}`)
                        : router.push(`/product?id=${item.id}`)
                    }
                  >
                    {item.type === "empresa" ? (
                      <>
                        <div className="flex items-center gap-4 mb-2">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.companyName}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center font-bold text-white">
                              {item.companyName?.[0]}
                            </div>
                          )}
                          <h3 className="font-bold">{item.companyName}</h3>
                        </div>
                        <p>{item.address}</p>
                        <p>Tel: {item.phone || "No disponible"}</p>
                      </>
                    ) : (
                      <>
                        <h3 className="font-bold">{item.productName}</h3>
                        {item.imageUrl && (
                          <img
                            src={item.imageUrl}
                            alt={item.productName}
                            className="h-32 object-contain my-2"
                          />
                        )}
                        <p>{item.description}</p>
                        <p className="font-semibold text-green-600">
                          Precio: ${item.price}
                        </p>
                      </>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-600">
                  No se encontraron resultados.
                </p>
              )
            ) : (
              <p className="text-center text-gray-600">
                Realiza una búsqueda para ver resultados.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
