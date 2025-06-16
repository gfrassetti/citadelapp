"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useUser } from "@/context/AuthContext";
import { db } from "@/lib/db/db";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import UserInfoActions from "@/components/UserInfoActions";

const schema = z.object({
  companyName: z.string().min(1, "Requerido"),
  address: z.string().min(1, "Requerido"),
  cuit: z.string().min(1, "Requerido"),
  postalCode: z.string().min(1, "Requerido"),
  website: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  whatsapp: z.string().optional(),
});


export default function EditCompanyInfoForm() {
  const { user } = useUser();
  const [loadingData, setLoadingData] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      companyName: "",
      address: "",
      cuit: "",
      postalCode: "",
      website: "",
      phone: "",
      email: "",
      whatsapp: "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.uid) return;
      const userSnap = await getDoc(doc(db, "users", user.uid));
      if (!userSnap.exists()) {
        setNotFound(true);
        setLoadingData(false);
        return;
      }

      const userData = userSnap.data();
      const empresaSnap = await getDoc(doc(db, "empresas", userData.empresaId));
      if (!empresaSnap.exists()) {
        setNotFound(true);
        setLoadingData(false);
        return;
      }

      const data = empresaSnap.data();
      form.reset(data);
      setLoadingData(false);
    };

    fetchData();
  }, [user, form]);

  if (loadingData) return <p className="text-sm text-gray-500">Cargando...</p>;
  if (notFound) return <p className="text-sm text-red-500">Empresa no encontrada.</p>;

  return (
    <div className="flex flex-col gap-6 px-6 md:px-16 mx-auto max-w-4xl">
      <div className="flex justify-end">
        <UserInfoActions
          editMode={editMode}
          loading={loading}
          onEdit={() => setEditMode(true)}
          onCancel={() => setEditMode(false)}
          onSave={form.handleSubmit(async (data) => {
            setLoading(true);
            try {
              const userSnap = await getDoc(doc(db, "users", user.uid));
              const userData = userSnap.data();
              const empresaRef = doc(db, "empresas", userData.empresaId);
          
              const cleanedData = Object.fromEntries(
                Object.entries(data).filter(([_, value]) => value !== undefined)
              );
          
              await setDoc(empresaRef, cleanedData, { merge: true });
          
              setEditMode(false);
              setSuccess(true);
              setTimeout(() => setSuccess(false), 5000);
            } catch (error) {
              console.error(error);
            } finally {
              setLoading(false);
            }
          })}          
        />
      </div>

      {success && (
        <Alert variant="success">
          <AlertTitle>¡Éxito!</AlertTitle>
          <AlertDescription>La información fue actualizada correctamente.</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <div className="flex flex-col gap-6">
          {["companyName", "address", "cuit", "postalCode", "website", "phone", "email", "whatsapp"].map((key, idx) => (
            <div key={key}>
              {idx > 0 && <Separator />}
              <FormField
                name={key}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-gray-600 capitalize">
                      {key}
                      {["companyName", "address", "cuit", "postalCode"].includes(key) && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </FormLabel>
                    {editMode ? (
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    ) : (
                      <p className="text-sm text-gray-900 dark:text-white mt-1">
                        {field.value || "-"}
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}
        </div>
      </Form>
    </div>
  );
}
