import { Suspense } from "react";
import HomeSearch from "@/components/HomeSearch";
import HomeBanner from "@/components/HomeBanner";

export default function Page() {
  return (
    <main className="w-full mx-auto text-center py-8">
      <Suspense fallback={<p>Cargando</p>}>
      <HomeBanner />
        <HomeSearch />
      </Suspense>
    </main>
  );
}
