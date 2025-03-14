import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/db/db";
import { addDoc, doc, collection, updateDoc } from "firebase/firestore";

export async function uploadCompanyData(data, userId) {
  try {
    let imageUrl = "";
    let folder = "company-logo";

    if (data.image) {
      const uniqueFileName = `${Date.now()}-${data.image.name}`;
      const storageRef = ref(storage, `${folder}/${uniqueFileName}`);
      await uploadBytes(storageRef, data.image);
      imageUrl = await getDownloadURL(storageRef);
    }

    const docRef = await addDoc(collection(db, "empresas"), {
      companyName: data.companyName,
      address: data.address,
      website: data.website,
      imageUrl,
      cuit: data.cuit,
      postalCode: data.postalCode,
      tags: data.tags || [], // Nueva propiedad para buscar por rubro
    });

    if (userId) {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { empresaId: docRef.id });
    }

    return docRef.id;
  } catch (error) {
    console.error("Error al subir datos de empresa:", error);
    throw error;
  }
}
