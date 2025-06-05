"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { uploadCompanyData } from "@/lib/db/handleUploadInfo";
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

export default function UploadInfo() {
  const form = useForm({
    defaultValues: {
      companyName: "",
      address: "",
      website: "",
      phone: "",
      email: "",
      whatsapp: "",
      image: null,
      cuit: "",
      postalCode: "",
    },    
  });

  const [uploading, setUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [createdEmpresaId, setCreatedEmpresaId] = useState(null);
  const { user } = useUser(); // user.uid

  const onSubmit = async (data) => {
    setUploading(true);
    try {
      const newEmpresaId = await uploadCompanyData(data, user.uid);
      setCreatedEmpresaId(newEmpresaId);

      setSuccessMessage("¡Subida exitosa!");
      form.reset();

      setTimeout(() => setSuccessMessage(""), 2000);
    } catch (error) {
      console.error("Error al subir datos:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 shadow-lg bg-white rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Sube la información de tu empresa</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            name="companyName"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre de la Empresa</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Mi Empresa S.A." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="address"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dirección</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Calle Falsa 123" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="phone"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ej: +54 9 11 1234 5678" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="whatsapp"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>WhatsApp</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ej: +54 9 11 9876 5432" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} placeholder="ejemplo@email.com" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="website"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="https://ejemplo.com" />
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

          <FormField
            name="cuit"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>CUIT</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="30-12345678-9" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="postalCode"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código Postal</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="1000" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full bg-blue-600" disabled={uploading}>
            {uploading ? "Subiendo..." : "Enviar Información"}
          </Button>
        </form>
      </Form>

      {successMessage && (
        <div className="mt-4 p-2 bg-green-100 text-green-800 rounded">
          {successMessage} <br />
          {createdEmpresaId && <p>ID creado: {createdEmpresaId}</p>}
        </div>
      )}
    </div>
  );
}
