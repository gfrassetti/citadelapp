import { useEffect, useState } from "react";
import { db } from "../lib/db/db";
import { collection, getDocs, orderBy, limit, query } from "firebase/firestore";

export function useCarouselData() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchCarousel = async () => {
      const productosRef = collection(db, "products");

      const recientesSnap = await getDocs(
        query(productosRef, orderBy("createdAt", "desc"), limit(10))
      );

      const masAñadidosSnap = await getDocs(
        query(productosRef, orderBy("price", "desc"), limit(10))
      );

      const aleatoriosSnap = await getDocs(query(productosRef, limit(10)));

      const mapDocs = (snap, title) => ({
        title,
        products: snap.docs.map((doc) => {
          const d = doc.data();
          return {
            img: d.imageUrl,
            price: d.price,
            name: d.productName || "Producto",
          };
        }),
      });

      setData([
        mapDocs(recientesSnap, "Recientes"),
        mapDocs(masAñadidosSnap, "Más añadidos"),
        mapDocs(aleatoriosSnap, "Sugerencias"),
      ]);
    };

    fetchCarousel();
  }, []);

  return data;
}
