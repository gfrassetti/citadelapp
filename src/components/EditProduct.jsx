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
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/db/db";
import { useUser } from "@/context/AuthContext";
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@/components/ui/alert";

const schema = z.object({
  name: z.string().min(1, "Requerido"),
  description: z.string().min(1, "Requerido"),
  price: z.string().min(1, "Requerido"),
  keywords: z.string().optional(),
});

export default function EditProduct() {
  const { user } = useUser();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      keywords: "",
    },
  });

  useEffect(() => {
    const loadProduct = async () => {
      if (!user?.uid) return;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      const empresaId = userDoc.data()?.empresaId;
      if (!empresaId) return;

      const productRef = doc(db, "products", empresaId);
      const productSnap = await getDoc(productRef);
      if (productSnap.exists()) {
        const product = productSnap.data();
        form.reset({
          name: product.name || "",
          description: product.description || "",
          price: product.price?.toString() || "",
          keywords: product.keywords || "",
        });
      }
    };

    loadProduct();
  }, [user?.uid, form]);

  const onSubmit = async (values) => {
    setLoading(true);
    setStatus(null);

    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const empresaId = userDoc.data()?.empresaId;
      if (!empresaId) throw new Error("empresaId no encontrado");

      const productRef = doc(db, "products", empresaId);
      await updateDoc(productRef, {
        name: values.name,
        description: values.description,
        price: Number(values.price),
        keywords: values.keywords || "",
      });

      setStatus({
        type: "success",
        message: "Producto actualizado correctamente.",
      });
    } catch (error) {
      console.error(error);
      setStatus({
        type: "error",
        message: "Hubo un error al actualizar el producto.",
      });
    } finally {
      setTimeout(() => setStatus(null), 4000);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded">
      <h3 className="text-xl font-bold mb-4">Editar Producto</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre del Producto</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="keywords"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Palabras clave</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <Button type="submit" className="bg-black text-white">
            {loading ? "Guardando..." : "Guardar Cambios"}
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
    </div>
  );
}
