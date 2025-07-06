import { Suspense } from "react";
import HomeSearch from "@/components/HomeSearch";

export default function Page() {
  return (
    <main className="w-full mx-auto text-center py-8">
      <Suspense fallback={<p>Cargando</p>}>
        <HomeSearch />
      </Suspense>
    </main>
  );
}
