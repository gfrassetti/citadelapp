import { db } from "@/lib/db/db";
import { collection, query, where, getDocs } from "firebase/firestore";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const searchTerm = searchParams.get("query")?.toLowerCase() || "";
    const filterType = searchParams.get("filter") || "all"; // "empresa", "rubro", "producto"

    let results = [];

    if (filterType === "empresa" || filterType === "all") {
      const empresasRef = collection(db, "empresas");
      const empresasSnapshot = await getDocs(empresasRef);
      empresasSnapshot.forEach((doc) => {
        const empresa = doc.data();
        if (
          empresa.companyName.toLowerCase().includes(searchTerm) ||
          empresa.tags?.some((tag) => tag.toLowerCase().includes(searchTerm))
        ) {
          results.push({ ...empresa, type: "empresa" });
        }
      });
    }

    if (filterType === "producto" || filterType === "all") {
      const productosRef = collection(db, "productos");
      const productosSnapshot = await getDocs(productosRef);
      productosSnapshot.forEach((doc) => {
        const producto = doc.data();
        if (
          producto.productName.toLowerCase().includes(searchTerm) ||
          producto.tags?.some((tag) => tag.toLowerCase().includes(searchTerm))
        ) {
          results.push({ ...producto, type: "producto" });
        }
      });
    }

    return new Response(JSON.stringify({ results }), { status: 200 });
  } catch (error) {
    console.error("Error en la búsqueda:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
