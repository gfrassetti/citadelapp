import { Suspense } from "react";
import HomeSearch from "@/components/HomeSearch";
import HomeBanner from "@/components/HomeBanner";
import HeroCarousel from "@/components/HeroCarousel";

export default function Page() {
  return (
    <main className="w-full mx-auto text-center pb-8">
      <Suspense fallback={<p>Cargando</p>}>
      <HomeBanner />
        <HeroCarousel />
          <HomeSearch />
      </Suspense>
    </main>
  );
}
