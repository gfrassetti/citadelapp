"use client";
import { useForm } from "react-hook-form";
import { auth } from "@/lib/db/db";
import {uploadCompanyData} from "@/lib/db/handleUpload";
import {
  Form, FormField, FormItem, FormLabel, FormControl, FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function UploadInfo() {
  const [uploading, setUploading] = useState(false);

  const form = useForm({
    defaultValues: {
      companyName: "",
      address: "",
      website: "",
      image: null,
      cuit: "",
      postalCode: "",
    },
  });

  const onSubmit = async (data) => {
    setUploading(true);
    try {
      await uploadCompanyData(data);
    } catch (error) {
      console.error("Error en la subida:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 shadow-lg bg-white rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Sube la información de tu empresa</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField name="companyName" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de la Empresa</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ingrese el nombre de la empresa" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField name="address" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Dirección</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ingrese la dirección" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField name="website" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Página Web</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ingrese la URL de la página web" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField name="image" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Imagen</FormLabel>
              <FormControl>
                <Input type="file" onChange={(e) => field.onChange(e.target.files[0])} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField name="cuit" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>CUIT</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ingrese su CUIT" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField name="postalCode" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Código Postal</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ingrese el código postal" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <Button type="submit" className="w-full bg-blue-600" disabled={uploading}>
            {uploading ? "Subiendo..." : "Enviar Información"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
