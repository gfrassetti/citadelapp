import { db } from "@/lib/db/db";
import { collection, getDocs } from "firebase/firestore";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const searchTerm = searchParams.get("query")?.toLowerCase().trim() || "";
    const filterType = searchParams.get("filter") || "all";

    let results = [];

    // Búsqueda en empresas
    if (filterType === "empresa" || filterType === "all") {
      const empresasRef = collection(db, "empresas");
      const empresasSnapshot = await getDocs(empresasRef);
      empresasSnapshot.forEach((doc) => {
        const empresa = doc.data();
        if (
          !searchTerm ||
          (empresa.companyName?.toLowerCase().includes(searchTerm)) ||
          (Array.isArray(empresa.tags) && empresa.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
        ) {
          results.push({ id: doc.id, ...empresa, type: "empresa" });
        }
      });
    }

    // Búsqueda en productos en la colección principal "products"
    if (filterType === "producto" || filterType === "all") {
      const productsRef = collection(db, "products");
      const productsSnapshot = await getDocs(productsRef);
      productsSnapshot.forEach((doc) => {
        const product = doc.data();
        if (
          !searchTerm ||
          (product.productName?.toLowerCase().includes(searchTerm)) ||
          (Array.isArray(product.tags) && product.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
        ) {
          results.push({ id: doc.id, ...product, type: "producto" });
        }
      });
    }

    return new Response(JSON.stringify({ results }), { status: 200 });
  } catch (error) {
    console.error("Error en la búsqueda:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
