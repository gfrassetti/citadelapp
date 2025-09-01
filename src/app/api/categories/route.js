export const runtime = "nodejs";

import { db } from "@/lib/db/db";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";

const SEED_CATEGORIES = [
  "Accesorios para Vehículos",
  "Alimentos y Bebidas",
  "Mascotas",
  "Arte, Librería",
  "Mercería",
  "Autos, Motos y Otros",
  "Computacion",
  "Construccion",
  "Deportes",
  "Electrónica, Audio y Video",
  "Herramientas",
  "Hogar, Muebles y Jardín",
  "Industrias y Oficinas",
  "Instrumentos Musicales",
  "Juegos y Juguetes",
  "Ropa y Accesorios",
  "Servicios",
  "Souvenirs, Cotillón y Fiestas",
  "Otras categorías",
];

const slug = (s) =>
  s
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

async function ensureSeed() {
  const snap = await getDocs(collection(db, "categories"));
  if (snap.size > 0) return; // ya hay datos

  await Promise.all(
    SEED_CATEGORIES.map(async (name) => {
      await setDoc(doc(db, "categories", slug(name)), {
        name,
        createdAt: new Date(),
      });
    })
  );
}

export async function GET() {
  await ensureSeed();
  const snap = await getDocs(collection(db, "categories"));
  const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  return Response.json(items);
}
