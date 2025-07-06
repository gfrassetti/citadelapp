import { Suspense } from "react";
import HomeSearch from "@/components/HomeSearch";

export default function Page() {
  return (
    <main className="max-w-7xl mx-auto text-center py-8">
      <Suspense fallback={<p>Cargando búsqueda...</p>}>
        <HomeSearch />
      </Suspense>
    </main>
  );
}
