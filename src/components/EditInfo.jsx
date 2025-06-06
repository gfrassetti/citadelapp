"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useUser } from "@/context/AuthContext";
import { db } from "@/lib/db/db";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";

const schema = z.object({
  companyName: z.string().min(2, "Requerido"),
  address: z.string().optional(),
  cuit: z.string().optional(),
  postalCode: z.string().optional(),
  website: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  whatsapp: z.string().optional(),
});

export default function EditCompanyInfoForm() {
  const { user } = useUser();
  const [loadingData, setLoadingData] = useState(true);
  const [notFound, setNotFound] = useState(false);

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
      console.log("🧾 UID actual:", user.uid);
      const ref = doc(db, "empresas", user.uid);
      const snap = await getDoc(ref);
      console.log("📄 Documento:", snap.exists(), snap.data());

      if (snap.exists()) {
        const data = snap.data();
        form.reset({
          companyName: data.companyName || "",
          address: data.address || "",
          cuit: data.cuit || "",
          postalCode: data.postalCode || "",
          website: data.website || "",
          phone: data.phone || "",
          email: data.email || "",
          whatsapp: data.whatsapp || "",
        });
      } else {
        setNotFound(true);
      }

      setLoadingData(false);
    };
    fetchData();
  }, [user, form]);

  const onSubmit = async (data) => {
    if (!user?.uid) return;
    const ref = doc(db, "empresas", user.uid);
    await setDoc(ref, data, { merge: true });
    alert("Información actualizada correctamente.");
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 flex justify-center items-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl w-full bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-200 p-12 dark:border-gray-700">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          Editar Información de la Empresa
        </h1>

        {loadingData ? (
          <p className="text-gray-500">Cargando datos...</p>
        ) : notFound ? (
          <p className="text-red-500">No se encontró información para este usuario.</p>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5"
            >
              {[
                { name: "companyName", label: "Nombre de la Empresa" },
                { name: "address", label: "Dirección" },
                { name: "cuit", label: "CUIT" },
                { name: "postalCode", label: "Código Postal" },
                { name: "website", label: "Website" },
                { name: "phone", label: "Teléfono" },
                { name: "email", label: "Email" },
                { name: "whatsapp", label: "WhatsApp" },
              ].map((field) => (
                <FormField
                  key={field.name}
                  name={field.name}
                  control={form.control}
                  render={({ field: f }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-gray-700 dark:text-gray-200">
                        {field.label}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...f}
                          className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-2 rounded"
              >
                Actualizar Información
              </Button>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
}
