import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/db/db";
import { doc, setDoc, updateDoc } from "firebase/firestore";

export async function uploadCompanyData(data, userId) {
  try {
    let imageUrl = "";
    const folder = "company-logo";

    if (data.image) {
      const uniqueFileName = `${Date.now()}-${data.image.name}`;
      const storageRef = ref(storage, `${folder}/${uniqueFileName}`);
      await uploadBytes(storageRef, data.image);
      imageUrl = await getDownloadURL(storageRef);
    }

    const empresaId = userId; // usamos el userId como empresaId
    const empresaRef = doc(db, "empresas", empresaId);

    const cleanData = {
      companyName: data.companyName || "",
      address: data.address || "",
      website: data.website || "",
      imageUrl,
      cuit: data.cuit || "",
      postalCode: data.postalCode || "",
      tags: data.tags || [],
      phone: data.phone || "",
      email: data.email || "",
      whatsapp: data.whatsapp || "",
    };

    await setDoc(empresaRef, cleanData, { merge: true });

    // actualizar empresaId del usuario si no lo tenía
    if (userId) {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { empresaId });
    }

    return empresaId;
  } catch (error) {
    console.error("Error al subir datos de empresa:", error);
    throw error;
  }
}
