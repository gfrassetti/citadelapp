"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateCompanyData, getCompanyData } from "@/lib/db/handleEditInfo";
import { useUser } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const schema = z.object({
  companyName: z.string().optional(),
  address: z.string().optional(),
  cuit: z.string().optional(),
  postalCode: z.string().optional(),
  website: z.string().optional(),
});

export default function EditInfo() {
  const { user } = useUser();

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

  const { register, handleSubmit, reset } = form;

  useEffect(() => {
    if (!user?.uid) return;

    getCompanyData(user.uid).then((data) => {
      if (data) {
        reset({
          companyName: data.companyName || "",
          address: data.address || "",
          cuit: data.cuit || "",
          postalCode: data.postalCode || "",
          website: data.website || "",
        });
      }
    });
  }, [user?.uid, reset]);

  const onSubmit = async (data) => {
    await updateCompanyData(user.uid, data);
    alert("Información actualizada");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto space-y-5 p-6 rounded border border-neutral-300"
      style={{ backgroundColor: "#f5f5f5", color: "#363636" }}
    >
      <div>
        <label className="block text-sm mb-1">Nombre de la empresa</label>
        <Input {...register("companyName")} className="bg-white text-black" />
      </div>
      <div>
        <label className="block text-sm mb-1">Dirección</label>
        <Input {...register("address")} className="bg-white text-black" />
      </div>
      <div>
        <label className="block text-sm mb-1">CUIT</label>
        <Input {...register("cuit")} className="bg-white text-black" />
      </div>
      <div>
        <label className="block text-sm mb-1">Código Postal</label>
        <Input {...register("postalCode")} className="bg-white text-black" />
      </div>
      <div>
        <label className="block text-sm mb-1">Website</label>
        <Input {...register("website")} className="bg-white text-black" />
      </div>
      <Button type="submit" className="bg-white text-black w-full">Actualizar</Button>
    </form>
  );
}
