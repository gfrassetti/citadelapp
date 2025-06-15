"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useUser } from "@/context/AuthContext";
import { db } from "@/lib/db/db";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2Icon, PencilIcon } from "lucide-react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";

const schema = z.object({
  companyName: z.string().min(2),
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
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
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

  const onSubmit = async (data) => {
    if (!user?.uid) return;
    setIsSaving(true);
    const userSnap = await getDoc(doc(db, "users", user.uid));
    const userData = userSnap.data();
    const empresaRef = doc(db, "empresas", userData.empresaId);
    await setDoc(empresaRef, data, { merge: true });
    setIsSaving(false);
    setIsEditing(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 5000);
  };

  if (loadingData) return <p className="text-sm text-gray-500">Cargando...</p>;
  if (notFound) return <p className="text-sm text-red-500">Empresa no encontrada.</p>;

  return (
    <div className="flex flex-col gap-6 px-6 md:px-16 py-10">
      <div className="flex justify-between items-start">
        <h2 className="text-2xl font-semibold">Datos de la Empresa</h2>
        {!isEditing ? (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            <PencilIcon className="w-4 h-4 mr-2" /> Editar
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
              Cancelar
            </Button>
            <Button size="sm" disabled={isSaving} onClick={form.handleSubmit(onSubmit)}>
              {isSaving ? <Loader2Icon className="w-4 h-4 animate-spin" /> : "Guardar"}
            </Button>
          </div>
        )}
      </div>

      {success && (
        <Alert variant="success">
          <AlertTitle>¡Éxito!</AlertTitle>
          <AlertDescription>La información fue actualizada correctamente.</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {["companyName", "address", "cuit", "postalCode", "website", "phone", "email", "whatsapp"].map((key) => (
            <FormField
              key={key}
              name={key}
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-gray-600 capitalize">{key}</FormLabel>
                  {isEditing ? (
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
          ))}
        </div>
      </Form>
    </div>
  );
}
