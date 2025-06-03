import { db } from "./db";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";

export async function getProductsByEmpresaId(uid) {
  const q = query(collection(db, "products"), where("empresaId", "==", uid));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function updateProductData(productId, data) {
  const ref = doc(db, "products", productId);
  await updateDoc(ref, data);
}
s