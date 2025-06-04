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
  companyName: z.string().min(1, "Requerido"),
  address: z.string().min(1, "Requerido"),
  cuit: z.string().min(1, "Requerido"),
  postalCode: z.string().min(1, "Requerido"),
  website: z.string().url("URL inválida"),
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

  const { register, handleSubmit, reset, formState: { errors } } = form;

  useEffect(() => {
    if (!user?.uid) return;
    getCompanyData(user.uid).then((data) => reset(data));
  }, [user?.uid]);

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
        <Input
          {...register("companyName")}
          className="bg-white text-black"
        />
        {errors.companyName && <p className="text-red-400 text-xs">{errors.companyName.message}</p>}
      </div>
      <div>
        <label className="block text-sm mb-1">Dirección</label>
        <Input
          {...register("address")}
          className="bg-white text-black"
        />
        {errors.address && <p className="text-red-400 text-xs">{errors.address.message}</p>}
      </div>
      <div>
        <label className="block text-sm mb-1">CUIT</label>
        <Input
          {...register("cuit")}
          className="bg-white text-black"
        />
        {errors.cuit && <p className="text-red-400 text-xs">{errors.cuit.message}</p>}
      </div>
      <div>
        <label className="block text-sm mb-1">Código Postal</label>
        <Input
          {...register("postalCode")}
          className="bg-white text-black"
        />
        {errors.postalCode && <p className="text-red-400 text-xs">{errors.postalCode.message}</p>}
      </div>
      <div>
        <label className="block text-sm mb-1">Website</label>
        <Input
          {...register("website")}
          className="bg-white text-black"
        />
        {errors.website && <p className="text-red-400 text-xs">{errors.website.message}</p>}
      </div>
      <Button type="submit" className="bg-white text-black w-full">Actualizar</Button>
    </form>
  );
}
