import { db, storage } from "./db";
import { doc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export async function uploadProductData(data, empresaId) {
  try {
    let imageUrl = "";

    if (data.image) {
      const folderPath = `company-products/${empresaId}`;
      const uniqueFileName = `${Date.now()}-${data.image.name}`;
      const storageRef = ref(storage, `${folderPath}/${uniqueFileName}`);

      await uploadBytes(storageRef, data.image);
      imageUrl = await getDownloadURL(storageRef);
    }

    const empresaRef = doc(db, "empresas", empresaId);
    const productsRef = collection(empresaRef, "products");

    await addDoc(productsRef, {
      productName: data.productName,
      description: data.description,
      price: data.price,
      imageUrl,
      createdAt: serverTimestamp(),
      tags: data.tags || [],
    });

    console.log("Producto subido con éxito:", imageUrl);
  } catch (error) {
    console.error("Error al subir producto:", error);
    throw error;
  }
}
