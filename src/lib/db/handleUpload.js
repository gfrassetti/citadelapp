import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/db/db";

export async function uploadCompanyData(data) {
  try {
    let imageUrl = "";
    let folder = "company-logo"; // Carpeta por defecto

    if (data.image) {
      if (data.imageType === "avatar") {
        folder = "avatars";
      } else if (data.imageType === "product") {
        folder = "company-products";
      }

      const storage = getStorage();
      const uniqueFileName = `${Date.now()}-${data.image.name}`;
      const storageRef = ref(storage, `${folder}/${uniqueFileName}`);

      await uploadBytes(storageRef, data.image);
      imageUrl = await getDownloadURL(storageRef);
    }

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
