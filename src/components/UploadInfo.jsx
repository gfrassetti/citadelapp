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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Image from "next/image";

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
  const [preview, setPreview] = useState(null);
  const { user } = useUser();

  const onSubmit = async (data) => {
    setUploading(true);
    try {
      const newEmpresaId = await uploadCompanyData(data, user.uid);
      setCreatedEmpresaId(newEmpresaId);
      setSuccessMessage("¡Subida exitosa!");
      form.reset();
      setPreview(null);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error al subir datos:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4">
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-bold">Información de la Empresa</CardTitle>
            <p className="text-muted-foreground text-sm">Carga los datos principales de tu negocio</p>
          </div>
          {preview && (
            <div className="w-20 h-20 rounded-full overflow-hidden border">
              <Image src={preview} alt="Preview" width={80} height={80} className="object-cover" />
            </div>
          )}
        </CardHeader>
        <Separator />

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {["companyName", "address", "phone", "whatsapp", "email", "website", "cuit", "postalCode"].map((fieldKey) => (
                <FormField
                  key={fieldKey}
                  name={fieldKey}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="capitalize">{fieldKey}</FormLabel>
                      <FormControl>
                        <Input {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}

              <div className="md:col-span-2">
                <FormField
                  name="image"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Logo o Imagen</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          required
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              form.setValue("image", file);
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
                <Button type="submit" className="btn" disabled={uploading}>
                  {uploading ? "Subiendo..." : "Enviar Información"}
                </Button>
              </div>
            </form>
          </Form>

          {successMessage && (
            <Alert variant="success" className="mt-6">
              <AlertTitle>{successMessage}</AlertTitle>
              <AlertDescription>
                {createdEmpresaId && <p>ID creado: {createdEmpresaId}</p>}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
