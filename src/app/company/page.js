// app/company/page.jsx
'use client';

import { Suspense } from "react";
import CompanyPageContent from "@/components/CompanyPageContent";

export default function EmpresaPage() {
  return (
    <Suspense fallback={<p className="text-center mt-10">Cargando empresa...</p>}>
      <CompanyPageContent />
    </Suspense>
  );
}
