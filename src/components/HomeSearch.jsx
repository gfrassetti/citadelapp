"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import clsx from "clsx";
import Loader from "@/components/Loader";
import Filters from "@/components/Filters";
import { Dialog } from "@/components/ui/dialog";
import ContactVendorModal from "@/components/ContactVendorModal";
import { getDoc, doc } from "firebase/firestore";
import { db } from "@/lib/db/db";

export default function HomeSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [term, setTerm] = useState("");
  const [results, setResults] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [tagSearch, setTagSearch] = useState("");
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

  const handleContact = async (item) => {
    if (item.empresa) {
      setSelectedProduct(item.empresa);
      setShowModal(true);
    } else if (item.empresaId) {
      try {
        const ref = doc(db, "empresas", item.empresaId);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          setSelectedProduct(data);
          setShowModal(true);
        } else {
          console.warn("Empresa no encontrada");
        }
      } catch (err) {
        console.error("Error al obtener empresa desde Firestore:", err);
      }
    } else {
      console.warn("Item sin empresa ni empresaId:", item);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const filteredResults = results.filter((item) => {
    if (!tagSearch.trim()) return true;
    const tags = item.tags || [];
    return tags.some((tag) =>
      tag.toLowerCase().includes(tagSearch.toLowerCase())
    );
  });

  return (
    <div className="w-full mx-auto p-4 h-max pt-[50px]">
      <div className="flex flex-col md:flex-row gap-6">
        <Filters
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
          tagSearch={tagSearch}
          setTagSearch={setTagSearch}
        />
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

          {loading ? (
            <div className="flex items-center justify-center h-80 w-full">
              <Loader text="Cargando..." />
            </div>
          ) : (
            <div
              className={clsx(
                "grid gap-6",
                "grid-cols-1",
                "sm:grid-cols-2",
                "md:grid-cols-3",
                "xl:grid-cols-4"
              )}
            >
              {searched ? (
                filteredResults.length > 0 ? (
                  filteredResults.map((item) => (
                    <div
                      key={item.id}
                      className={clsx(
                        "marketplace-card cursor-pointer",
                        "dark"
                      )}
                      onClick={() => {
                        const base = item.type === "empresa" ? "company" : "product";
                        router.push(`/${base}?id=${item.id}&query=${term}&filter=${selectedFilter}`);
                      }}
                    >
                      {item.type === "empresa" ? (
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
                            <div className="flex flex-wrap gap-1 mt-1">
                              {(item.tags || []).map((tag, index) => (
                                <span
                                  key={index}
                                  className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-100 px-2 py-0.5 rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
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
                            onClick={(e) => {
                              e.stopPropagation();
                              handleContact(item);
                            }}
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
          )}
        </div>
      </div>

      {showModal && selectedProduct && (
        <ContactVendorModal
          open={showModal}
          onClose={handleCloseModal}
          contact={selectedProduct}
        />
      )}
    </div>
  );
}
