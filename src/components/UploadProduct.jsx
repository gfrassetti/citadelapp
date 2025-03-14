"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { uploadProductData } from "@/lib/db/handleUploadProduct";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function UploadProduct({ empresaId }) {
  const [uploading, setUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const form = useForm({
    defaultValues: {
      productName: "",
      description: "",
      price: "",
      image: null,
      tags: "", // Nuevo campo para tags de búsqueda
    },
  });

  const onSubmit = async (data) => {
    if (!empresaId) {
      alert("No se ha proporcionado empresaId.");
      return;
    }
    setUploading(true);
    try {
      const formattedData = {
        ...data,
        tags: typeof data.tags === "string" 
          ? data.tags.split(",").map(tag => tag.trim()) 
          : Array.isArray(data.tags) 
            ? data.tags 
            : [], // Si no es string ni array, se asigna un array vacío
      };
      await uploadProductData(formattedData, empresaId);
      setSuccessMessage("¡Producto subido exitosamente!");
      form.reset();
      setTimeout(() => setSuccessMessage(""), 1000);
    } catch (error) {
      console.error("Error al subir producto:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 shadow-lg bg-white rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Sube un producto</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            name="productName"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre del Producto</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ej: Computadora" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="description"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ej: Core i7, 16GB RAM" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="price"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio</FormLabel>
                <FormControl>
                  <Input type="number" {...field} placeholder="500" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        <FormField
          name="tags"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Palabras clave (separadas por comas)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Ej: acero, cables, bobinas"
                  onChange={(e) => field.onChange(e.target.value.split(","))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

          <FormField
            name="image"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Imagen</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    onChange={(e) => field.onChange(e.target.files[0])}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full bg-blue-600" disabled={uploading}>
            {uploading ? "Subiendo..." : "Subir Producto"}
          </Button>
        </form>

        {successMessage && (
          <div className="mt-4 p-2 bg-green-100 text-green-800 rounded">
            {successMessage}
          </div>
        )}
      </Form>
    </div>
  );
}
