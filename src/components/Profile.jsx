"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

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

import { auth, db, storage } from "@/lib/db/db";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject, ref as storageRef } from "firebase/storage";
import { updatePassword } from "firebase/auth";

const formSchema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres"),
  email: z.string().email("Formato de correo inválido"),
  plan: z.string().optional(),
  subscription: z.string().optional(),
  avatar: z.any().optional(),
  newPassword: z.string().optional(),
  confirmPassword: z.string().optional(), // Si quieres confirmar contraseña
});

export default function Profile() {
  const [loading, setLoading] = useState(false);
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState("");

  const { control, handleSubmit, reset, watch } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      plan: "",
      subscription: "",
      avatar: null,
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Para comparar contraseñas si deseas
  const newPasswordValue = watch("newPassword");
  const confirmPasswordValue = watch("confirmPassword");

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    (async () => {
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          const data = snap.data();
          setCurrentAvatarUrl(data.avatarUrl || "");
          reset({
            name: data.name || "",
            email: data.email || "",
            plan: data.plan || "",
            subscription: data.subscription || "",
            avatar: null,
            newPassword: "",
            confirmPassword: "",
          });
        }
      } catch (err) {
        console.error("Error al cargar datos:", err);
      }
    })();
  }, [reset]);

  async function onSubmit(values) {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No hay usuario autenticado.");

      // Verifica contraseñas si deseas
      if (values.newPassword && values.newPassword !== values.confirmPassword) {
        throw new Error("Las contraseñas no coinciden");
      }

      let avatarUrl = currentAvatarUrl;

      // Si sube un nuevo archivo
      if (values.avatar instanceof File) {
        const file = values.avatar;
        const storageRef = ref(storage, `avatars/${user.uid}/${file.name}`);
        await uploadBytes(storageRef, file);
        avatarUrl = await getDownloadURL(storageRef);
      }

      // Actualiza Firestore
      const userRef = doc(db, "users", user.uid);
      const updateData = {
        name: values.name,
        email: values.email,
        plan: values.plan || "",
        subscription: values.subscription || "",
        avatarUrl,
      };

      await updateDoc(userRef, updateData);

      // Cambiar contraseña si se proporcionó
      if (values.newPassword && values.newPassword.length > 0) {
        await updatePassword(user, values.newPassword);
      }

      toast.success("Perfil actualizado", {
        description: "Tus datos se han guardado correctamente.",
      });

      setCurrentAvatarUrl(avatarUrl);

      // Resetea el form
      reset({
        name: values.name,
        email: values.email,
        plan: values.plan,
        subscription: values.subscription,
        avatar: null,
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al actualizar", {
        description: "Hubo un error: " + error.message,
      });
    } finally {
      setLoading(false);
    }
  }

  // Quitar avatar
  async function handleRemoveAvatar() {
    try {
      const user = auth.currentUser;
      if (!user || !currentAvatarUrl) return;
  
      // Crea una referencia al archivo usando la URL
      const fileRef = storageRef(storage, currentAvatarUrl);
      await deleteObject(fileRef);
  
      // Actualiza Firestore para quitar el avatar
      await updateDoc(doc(db, "users", user.uid), { avatarUrl: "" });
      setCurrentAvatarUrl("");
      toast("Avatar removido");
    } catch (error) {
      console.error("Error al remover avatar:", error);
      toast.error("No se pudo remover el avatar");
    }
  }

  return (
    <div className="mx-auto mt-8 w-full max-w-7xl px-4">
      {/* Contenedor principal con dos columnas */}
      <div className="flex flex-col gap-6 md:flex-row">
        {/* Columna Izquierda (Avatar / Info Básica) */}
        <div className="md:w-1/3 bg-white p-6 shadow rounded">
          <h3 className="mb-4 text-xl font-bold">Profile</h3>
          <div className="flex flex-col items-center">
            {currentAvatarUrl ? (
              <img
                src={currentAvatarUrl}
                alt="Avatar actual"
                className="mb-4 h-32 w-32 rounded-full object-cover"
              />
            ) : (
              <div className="mb-4 h-32 w-32 rounded-full bg-gray-200" />
            )}

            {currentAvatarUrl ? (
              <Button variant="destructive" onClick={handleRemoveAvatar}>
                Quitar Avatar
              </Button>
            ) : (
              <p className="text-sm text-gray-500">No tienes avatar.</p>
            )}
          </div>
        </div>

        {/* Columna Derecha (Formulario de edición) */}
        <div className="md:w-2/3 bg-white p-6 shadow rounded">
          <h3 className="text-xl font-bold mb-4">Edit Details</h3>
          <Form control={control}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Nombre */}
                <FormField
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input placeholder="Tu nombre" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Email */}
                <FormField
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="correo@ejemplo.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Plan (lectura) */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name="plan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plan Actual</FormLabel>
                      <FormControl>
                        <Input disabled {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Suscripción (lectura) */}
                <FormField
                  control={control}
                  name="subscription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Suscripción</FormLabel>
                      <FormControl>
                        <Input disabled {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Subir nuevo avatar */}
              <FormField
                control={control}
                name="avatar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nuevo Avatar</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) field.onChange(file);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Sección Cambio de Contraseña */}
              <h4 className="mt-6 text-lg font-semibold">Change Password</h4>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nueva Contraseña</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Dejar vacío para no cambiar"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar Contraseña</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Repite la nueva contraseña"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="pt-4">
                <Button type="submit" disabled={loading}>
                  {loading ? "Guardando..." : "Guardar Cambios"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
