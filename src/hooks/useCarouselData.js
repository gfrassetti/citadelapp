import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, where, limit } from "firebase/firestore";
import { db } from "@/lib/db/db";

export function useCarouselData() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchCarousel = async () => {
      const result = [];

      // Slide 1: últimos productos
      const recentSnap = await getDocs(
        query(collection(db, "products"), orderBy("createdAt", "desc"), limit(6))
      );
      const recentProducts = recentSnap.docs.map(doc => doc.data()).slice(0, 3);
      result.push({
        title: "Recientemente Añadidos",
        products: recentProducts.map(p => ({
          img: p.images?.[0] || "/fallback.jpg",
          price: `US$ ${p.price?.toFixed(2) || "--"}`,
        })),
      });

      // Slide 2: productos por tag
      const taggedSnap = await getDocs(
        query(collection(db, "products"), where("tags", "array-contains", "negocios"), limit(6))
      );
      const taggedProducts = taggedSnap.docs.map(doc => doc.data()).slice(0, 3);
      result.push({
        title: "Para Negocios",
        products: taggedProducts.map(p => ({
          img: p.images?.[0] || "/fallback.jpg",
          price: `US$ ${p.price?.toFixed(2) || "--"}`,
        })),
      });

      // Slide 3: empresas por tag
      const companySnap = await getDocs(
        query(collection(db, "users"), where("tags", "array-contains", "vacaciones"), limit(6))
      );
      const companies = companySnap.docs.map(doc => doc.data()).slice(0, 3);
      result.push({
        title: "Empresas destacadas",
        products: companies.map(c => ({
          img: c.avatarUrl || "/fallback-company.jpg",
          price: c.website || "Ver más",
        })),
      });

      setData(result);
    };

    fetchCarousel();
  }, []);

  return data;
}
