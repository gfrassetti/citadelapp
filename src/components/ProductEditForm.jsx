"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { doc, deleteDoc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/db/db";
import { useRouter } from "next/navigation";

export default function ProductEditForm({ productId }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      productName: "",
      description: "",
      price: "",
      tags: "",
      imageUrl: "",
    },
  });

  useEffect(() => {
    async function fetchProduct() {
      const snap = await getDoc(doc(db, "products", productId));
      if (snap.exists()) {
        const data = snap.data();
        form.reset({
          productName: data.productName || "",
          description: data.description || "",
          price: data.price || "",
          tags: data.tags?.join(", ") || "",
          imageUrl: data.imageUrl || "",
        });
      }
    }
    fetchProduct();
  }, [productId, form]);

  const onSubmit = async (values) => {
    setLoading(true);
    setStatus(null);
    try {
      await updateDoc(doc(db, "products", productId), {
        productName: values.productName,
        description: values.description,
        price: values.price,
        tags: values.tags.split(",").map((t) => t.trim()),
        imageUrl: values.imageUrl,
      });
      setStatus({ type: "success", message: "Producto actualizado correctamente." });
    } catch (error) {
      setStatus({ type: "error", message: "Error al actualizar el producto." });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    await deleteDoc(doc(db, "products", productId));
    router.push("/dashboard");
  };

  return (
    <div className="max-w-md mx-auto space-y-4 p-4">
      <Button variant="outline" className="text-sm" onClick={() => router.back()}>
        ← Volver
      </Button>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="productName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre del Producto</FormLabel>
                <FormControl><Input {...field} /></FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción</FormLabel>
                <FormControl><Input {...field} /></FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio</FormLabel>
                <FormControl><Input {...field} /></FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Palabras clave</FormLabel>
                <FormControl><Input {...field} /></FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL de la Imagen</FormLabel>
                <FormControl><Input {...field} /></FormControl>
              </FormItem>
            )}
          />

          <div className="flex items-center gap-2">
            <Button type="submit">{loading ? "Guardando..." : "Guardar Cambios"}</Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" type="button">Eliminar</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Eliminar producto?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer. El producto será eliminado permanentemente.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Confirmar</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {status && (
            <Alert variant={status.type === "error" ? "destructive" : "default"}>
              <AlertTitle>{status.type === "error" ? "Error" : "Éxito"}</AlertTitle>
              <AlertDescription>{status.message}</AlertDescription>
            </Alert>
          )}
        </form>
      </Form>
    </div>
  );
}
