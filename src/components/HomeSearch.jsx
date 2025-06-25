"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import clsx from "clsx";
import Loader from "@/components/Loader";
import Filters from "@/components/Filters";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export default function HomeSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme } = useTheme();

  const [term, setTerm] = useState("");
  const [results, setResults] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const query = searchParams.get("query") || "";
    const filter = searchParams.get("filter") || "all";
    if (query || filter) {
      setTerm(query);
      setSelectedFilter(filter);
      fetchResults(query, filter);
    }
    // eslint-disable-next-line
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

  // Abrir modal solo para productos
  const handleContact = (item) => {
    setSelectedProduct(item);
    setShowModal(true);
  };
  

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 w-full h-max pt-[80px]">
      {/* Barra de búsqueda */}
      <div className="flex flex-col md:flex-row gap-6">
        <Filters selectedFilter={selectedFilter} setSelectedFilter={setSelectedFilter} />
        <div className="flex-1 bg-[#f4f4f4] p-4">
          <div className="flex gap-2 mb-6">
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

          {/* Grid de resultados tipo marketplace */}
          <div className={clsx(
            "grid gap-6",
            "grid-cols-1",
            "sm:grid-cols-2",
            "md:grid-cols-3",
            "xl:grid-cols-4"
          )}>
            {loading ? (
              <Loader text="Cargando..." />
            ) : searched ? (
              results.length > 0 ? (
                results.map((item) => (
                  <div
                    key={item.id}
                    className={clsx(
                      "marketplace-card",
                      theme === "dark" ? "dark" : ""
                    )}
                  >
                    {item.type === "empresa" ? (
                      <>
                        <div className="flex items-center gap-4 mb-3">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.companyName}
                              className="h-12 w-12 rounded-full object-cover border"
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center font-bold text-xl text-gray-600 dark:bg-gray-700 dark:text-white">
                              {item.companyName?.[0]}
                            </div>
                          )}
                          <div>
                            <h3 className="font-bold text-lg">{item.companyName}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-300">{item.address}</p>
                          </div>
                        </div>
                        <div className="text-sm mb-3">
                          <div>Tel: <span className="font-medium">{item.phone || "-"}</span></div>
                          <div>Email: <span className="font-medium">{item.email || "-"}</span></div>
                          {item.minOrder && (
                            <div className="text-xs mt-2 text-blue-600 font-bold">
                              Orden mínima: {item.minOrder}
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        {item.imageUrl && (
                          <img
                            src={item.imageUrl}
                            alt={item.productName}
                            className="h-40 w-full object-contain mb-3 rounded-lg bg-gray-50"
                          />
                        )}
                        <h3 className="font-bold text-lg mb-1">{item.productName}</h3>
                        <p className="text-gray-500 dark:text-gray-300 text-sm mb-2">{item.description}</p>
                        <div className="font-bold text-green-600 mb-1">
                          Precio: ${item.price}
                        </div>
                        <div className="text-xs text-blue-700 dark:text-blue-300 mb-2">
                          Orden mínima: {item.minOrder || "1 unidad"}
                        </div>
                        <button
                          onClick={() => handleContact(item)}
                          className="btn-secondary"
                        >
                          Contactar al vendedor
                        </button>

                      </>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-600 col-span-full">
                  No se encontraron resultados.
                </p>
              )
            ) : (
              <p className="text-center text-gray-600 col-span-full">
                Realiza una búsqueda para ver resultados.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Modal para contactar al vendedor (solo productos) */}
      {showModal && selectedProduct && (
        <Dialog open={showModal} onOpenChange={handleCloseModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Contactar al vendedor
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <div>
                <strong>Producto:</strong> {selectedProduct.productName}
              </div>
              <div>
                <strong>Precio:</strong> ${selectedProduct.price}
              </div>
              <div>
                <strong>Orden mínima:</strong> {selectedProduct.minOrder || "1 unidad"}
              </div>
              {/* Agregá más info según tu modelo */}
              <div>
                <strong>Descripción:</strong> {selectedProduct.description}
              </div>
              <div>
                <strong>Email:</strong> {selectedProduct.email || "-"}
              </div>
              <div>
                <strong>Teléfono:</strong> {selectedProduct.phone || "-"}
              </div>
            </div>
            <DialogFooter>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={handleCloseModal}
              >
                Cerrar
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
