// handleUpload.js
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import { db, storage } from "@/lib/db/db"; // Importa storage desde db.js

export async function uploadCompanyData(data) {
  try {
    let imageUrl = "";
    let folder = "company-logo"; // Carpeta por defecto

    // Elige la carpeta según el tipo de imagen
    if (data.image) {
      if (data.imageType === "avatar") {
        folder = "avatars";
      } else if (data.imageType === "product") {
        folder = "company-products";
      }

      // Crea referencia en Storage
      const uniqueFileName = `${Date.now()}-${data.image.name}`;
      const storageRef = ref(storage, `${folder}/${uniqueFileName}`);

      // Sube el archivo
      await uploadBytes(storageRef, data.image);
      // Obtén la URL pública
      imageUrl = await getDownloadURL(storageRef);
    }

    // Guarda los datos en Firestore
    await addDoc(collection(db, "empresas"), {
      companyName: data.companyName,
      address: data.address,
      website: data.website,
      imageUrl,
      cuit: data.cuit,
      postalCode: data.postalCode,
    });

    console.log("Datos subidos con éxito:", imageUrl);
  } catch (error) {
    console.error("Error al subir datos:", error);
    throw error;
  }
}
