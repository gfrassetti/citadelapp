// handleUpload.js
import { db, storage } from "./db"; // Ajusta según tu proyecto
import { doc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

/**
 * Sube un producto y lo asocia a la empresa con ID `empresaId`.
 */
export async function uploadProductData(data, empresaId) {
  try {
    let imageUrl = "";

    if (data.image) {
      // Carpeta: 'company-products/<empresaId>/archivo'
      const folderPath = `company-products/${empresaId}`;
      const uniqueFileName = `${Date.now()}-${data.image.name}`;
      const storageRef = ref(storage, `${folderPath}/${uniqueFileName}`);

      // Sube el archivo
      await uploadBytes(storageRef, data.image);
      // Obtén la URL pública
      imageUrl = await getDownloadURL(storageRef);
    }

    // Apuntamos al doc de la empresa y luego a la subcolección 'products'
    const empresaRef = doc(db, "empresas", empresaId);
    const productsRef = collection(empresaRef, "products");

    // Creamos un documento en la subcolección
    await addDoc(productsRef, {
      productName: data.productName,
      description: data.description,
      price: data.price,
      imageUrl,
      createdAt: serverTimestamp(),
    });

    console.log("Producto subido con éxito:", imageUrl);
  } catch (error) {
    console.error("Error al subir producto:", error);
    throw error;
  }
}
