"use client";

import { useTheme } from "next-themes";
import clsx from "clsx";
import { ChevronRight } from "lucide-react";

export default function CategoriesCarousel({ categories = [], onCategoryClick, onShowAll }) {
  const { theme } = useTheme();

  return (
    <div
      className={clsx(
        "rounded-lg p-4",
        theme === "dark" ? "bg-gray-800" : "bg-white"
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h2
          className={clsx(
            "text-lg font-semibold",
            theme === "dark" ? "text-white" : "text-gray-900"
          )}
        >
          Categorías
        </h2>
        <button
          onClick={onShowAll}
          className={clsx(
            "text-sm font-medium hover:underline",
            theme === "dark" ? "text-[#06f388]" : "text-blue-600"
          )}
        >
          Mostrar todas las categorías
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryClick?.(cat)}
            className={clsx(
              "flex items-center gap-3 rounded-lg border p-3 transition-colors",
              theme === "dark"
                ? "border-[#06f388] text-white hover:bg-gray-700"
                : "border-gray-200 text-gray-900 hover:bg-gray-50"
            )}
          >
            {cat.icon && (
              <img
                src={cat.icon}
                alt={cat.name}
                className="w-8 h-8 object-contain"
              />
            )}
            <span className="text-sm font-medium">{cat.name}</span>
            <ChevronRight className="ml-auto h-4 w-4 opacity-50" />
          </button>
        ))}
      </div>
    </div>
  );
}
