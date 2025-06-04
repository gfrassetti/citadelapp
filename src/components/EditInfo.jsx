"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/AuthContext";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/db/db";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

const schema = z.object({
  companyName: z.string().optional(),
  address: z.string().optional(),
  cuit: z.string().optional(),
  postalCode: z.string().optional(),
  website: z.string().optional(),
});

export default function EditInfo() {
  const { user } = useUser();
  const [status, setStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      companyName: "",
      address: "",
      cuit: "",
      postalCode: "",
      website: "",
    },
  });

  useEffect(() => {
    if (!user?.uid) return;

    const loadCompany = async () => {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const empresaId = userDoc.data()?.empresaId;
      if (!empresaId) return;

      const empresaDoc = await getDoc(doc(db, "empresas", empresaId));
      const empresaData = empresaDoc.data();
      if (empresaData) {
        form.reset({
          companyName: empresaData.companyName || "",
          address: empresaData.address || "",
          cuit: empresaData.cuit || "",
          postalCode: empresaData.postalCode || "",
          website: empresaData.website || "",
        });
      }
    };

    loadCompany();
  }, [user?.uid, form.reset]);

  const onSubmit = async (values) => {
    setIsSubmitting(true);
    setStatus(null);

    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const empresaId = userDoc.data()?.empresaId;
      if (!empresaId) throw new Error("No se encontró empresaId");

      const empresaRef = doc(db, "empresas", empresaId);
      await updateDoc(empresaRef, values);

      setStatus({ type: "success", message: "Información actualizada correctamente." });
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", message: "Hubo un error al guardar." });
    } finally {
      setTimeout(() => setStatus(null), 4000);
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-md mx-auto space-y-5 p-6 rounded border border-neutral-300 bg-gray-100"
      >
        {["companyName", "address", "cuit", "postalCode", "website"].map((field) => (
          <FormField
            key={field}
            name={field}
            control={form.control}
            render={({ field: f }) => (
              <FormItem>
                <FormLabel className="capitalize text-black">
                  {getLabel(field)}
                </FormLabel>
                <FormControl>
                  <Input {...f} className="bg-white text-black" />
                </FormControl>
              </FormItem>
            )}
          />
        ))}

        <Button type="submit" className="w-full">
          {isSubmitting ? "Actualizando..." : "Actualizar"}
        </Button>

        {status && (
          <Alert variant={status.type === "error" ? "destructive" : "default"}>
            <AlertTitle>
              {status.type === "error" ? "Error" : "Éxito"}
            </AlertTitle>
            <AlertDescription>{status.message}</AlertDescription>
          </Alert>
        )}
      </form>
    </Form>
  );
}

function getLabel(field) {
  const labels = {
    companyName: "Nombre de la empresa",
    address: "Dirección",
    cuit: "CUIT",
    postalCode: "Código Postal",
    website: "Website",
  };
  return labels[field] || field;
}