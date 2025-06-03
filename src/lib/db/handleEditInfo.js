import { db } from "./db";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export async function getCompanyData(uid) {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : {};
}

export async function updateCompanyData(uid, data) {
  const ref = doc(db, "users", uid);
  await updateDoc(ref, data);
}
