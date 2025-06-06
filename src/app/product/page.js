import { Suspense } from "react";
import ProductPageContent from "@/components/ProductPageContent";

export default function Page() {
  return (
    <div className="max-w-7xl mx-auto p-6 mt-[6rem]">
      <Suspense fallback={<p>Cargando producto...</p>}>
        <ProductPageContent />
      </Suspense>
    </div>
  );
}
