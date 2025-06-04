"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { updateCompanyData, getCompanyData } from "@/lib/db/handleEditInfo";
import { useUser } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function EditInfo() {
  const { user } = useUser();
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (!user?.uid) return;
    getCompanyData(user.uid).then((data) => reset(data));
  }, [user?.uid]);

  const onSubmit = async (data) => {
    await updateCompanyData(user.uid, data);
    alert("Información actualizada");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
      <div>
        <label>Nombre de la empresa</label>
        <Input {...register("companyName")} />
      </div>
      <div>
        <label>Dirección</label>
        <Input {...register("address")} />
      </div>
      <div>
        <label>Teléfono</label>
        <Input {...register("phone")} />
      </div>
      <div>
        <label>Whatsapp</label>
        <Input {...register("whatsapp")} />
      </div>
      <div>
        <label>Email</label>
        <Input {...register("email")} />
      </div>
      <div>
        <label>Website</label>
        <Input {...register("website")} />
      </div>
      <div>
        <label>CUIT</label>
        <Input {...register("cuit")} />
      </div>
      <div>
        <label>Código Postal</label>
        <Input {...register("postalCode")} />
      </div>
      <Button type="submit" className="bg-blue-600">Actualizar</Button>
    </form>
  );
}
