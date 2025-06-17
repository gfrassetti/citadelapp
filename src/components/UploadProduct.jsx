"use client";

import { useEffect, useState } from "react";
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
import { useUser } from "@/context/AuthContext";
import { doc, setDoc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/db/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Image from "next/image";

export default function UploadProduct({ empresaId: initialEmpresaId }) {
  const [uploading, setUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [empresaId, setEmpresaId] = useState(initialEmpresaId || null);
  const [preview, setPreview] = useState(null);
  const { user } = useUser();

  const form = useForm({
    defaultValues: {
      productName: "",
      description: "",
      price: "",
      image: null,
      tags: "",
    },
  });

  useEffect(() => {
    if (!user?.uid || empresaId) return;

    const crearEmpresa = async () => {
      const generatedEmpresaId = user.uid;
      const empresaRef = doc(db, "empresas", generatedEmpresaId);

      const empresaDoc = await getDoc(empresaRef);
      if (!empresaDoc.exists()) {
        await setDoc(empresaRef, {
          companyName: "Mi Empresa",
          createdAt: new Date(),
          address: "",
          cuit: "",
          website: "",
          postalCode: "",
          tags: [],
        });
      }

      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { empresaId: generatedEmpresaId });
      setEmpresaId(generatedEmpresaId);
    };

    crearEmpresa();
  }, [user?.uid, empresaId]);

  const onSubmit = async (data) => {
    if (!user?.uid || !user?.email || !empresaId) {
      alert("Faltan datos del usuario o empresa.");
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
            : [],
      };

      await uploadProductData(formattedData, empresaId);
      setSuccessMessage("¡Producto subido exitosamente!");
      form.reset();
      setPreview(null);
      setTimeout(() => setSuccessMessage(""), 2000);
    } catch (error) {
      console.error("Error al subir producto:", error);
    } finally {
      setUploading(false);
    }
  };

  if (!empresaId) return <p className="text-center">Cargando...</p>;

  return (
    <div className="w-full max-w-4xl mx-auto py-10 px-4">
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-bold">Sube un producto</CardTitle>
            <p className="text-muted-foreground text-sm">Publica tu producto para que sea visible</p>
          </div>
          {preview && (
            <div className="w-20 h-20 rounded overflow-hidden border">
              <Image src={preview} alt="Preview" width={80} height={80} className="object-cover" />
            </div>
          )}
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <FormLabel>Palabras clave</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Ej: acero, cables, bobinas"
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="md:col-span-2">
                <FormField
                  name="image"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Imagen</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              field.onChange(file);
                              const reader = new FileReader();
                              reader.onloadend = () => setPreview(reader.result);
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="md:col-span-2">
                <Button type="submit" className="w-full bg-blue-600" disabled={uploading}>
                  {uploading ? "Subiendo..." : "Subir Producto"}
                </Button>
              </div>
            </form>
          </Form>

          {successMessage && (
            <Alert variant="success" className="mt-6">
              <AlertTitle>{successMessage}</AlertTitle>
              <AlertDescription>Tu producto ya está disponible.</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}