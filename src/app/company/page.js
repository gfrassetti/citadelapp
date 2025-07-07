import { Suspense } from "react";
import CompanyPageContent from "@/components/CompanyPageContent";

export default function Page() {
  return (
    <div className="max-w-7xl mx-auto p-6 mt-2">
      <Suspense fallback={<p>Cargando empresa...</p>}>
        <CompanyPageContent />
      </Suspense>
    </div>
  );
}
