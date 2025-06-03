"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { updateCompanyData, getCompanyData } from "@/lib/db/handleEditInfo";
import { useUser } from "@/context/AuthContext";
import {
  Form, FormField, FormItem, FormLabel, FormControl, FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function EditInfo() {
  const { user } = useUser();
  const form = useForm({ defaultValues: {} });

  useEffect(() => {
    if (!user?.uid) return;
    getCompanyData(user.uid).then((data) => form.reset(data));
  }, [user?.uid]);

  const onSubmit = async (data) => {
    await updateCompanyData(user.uid, data);
    alert("Información actualizada");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4">
        {["companyName", "address", "phone", "whatsapp", "email", "website", "cuit", "postalCode"].map((field) => (
          <FormField key={field.name} name={field} control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>{field}</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        ))}
        <Button type="submit" className="bg-blue-600">Actualizar</Button>
      </form>
    </Form>
  );
}
