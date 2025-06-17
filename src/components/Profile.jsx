"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { auth, db, storage } from "@/lib/db/db";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { updatePassword } from "firebase/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Loader2Icon } from "lucide-react";
import UserInfoActions from "@/components/UserInfoActions";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  plan: z.string().optional(),
  subscription: z.string().optional(),
  avatar: z.any().optional(),
  newPassword: z.string().optional(),
  confirmPassword: z.string().optional(),
});

export default function Profile() {
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState("");

  const form = useForm({
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

  const { reset } = form;

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    (async () => {
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
    })();
  }, [reset]);

  async function onSubmit(values) {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Usuario no autenticado.");

      if (values.newPassword && values.newPassword !== values.confirmPassword) {
        throw new Error("Las contraseñas no coinciden");
      }

      let avatarUrl = currentAvatarUrl;
      if (values.avatar instanceof File) {
        const file = values.avatar;
        const path = ref(storage, `avatars/${user.uid}/${file.name}`);
        await uploadBytes(path, file);
        avatarUrl = await getDownloadURL(path);
      }

      await updateDoc(doc(db, "users", user.uid), {
        name: values.name,
        email: values.email,
        plan: values.plan,
        subscription: values.subscription,
        avatarUrl,
      });

      // CAMBIA EL PASSWORD EN FIREBASE AUTH
      if (values.newPassword) await updatePassword(user, values.newPassword);

      setCurrentAvatarUrl(avatarUrl);
      setEditMode(false);
      toast.success("Perfil actualizado correctamente.");

      reset({
        ...values,
        avatar: null,
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      toast.error(err.message || "Hubo un error al guardar los datos.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 px-6 md:px-16 py-10">
      <h2 className="text-2xl font-bold">Datos personales</h2>
      <h3 className="text-base font-semibold text-muted-foreground">Usuario</h3>

      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <img
            src={currentAvatarUrl || "/default-avatar.png"}
            className="w-14 h-14 rounded-full object-cover border"
            alt="avatar"
          />

          {editMode && (
            <div className="flex flex-col gap-2">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) form.setValue("avatar", file);
                }}
                className="w-64 text-sm"
              />

              {currentAvatarUrl && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={async () => {
                    const user = auth.currentUser;
                    if (!user) return;
                    try {
                      await deleteObject(ref(storage, currentAvatarUrl));
                      await updateDoc(doc(db, "users", user.uid), { avatarUrl: "" });
                      setCurrentAvatarUrl("");
                    } catch (err) {
                      console.error("Error al eliminar avatar:", err);
                    }
                  }}
                >
                  Quitar avatar
                </Button>
              )}
            </div>
          )}
        </div>

        <UserInfoActions
          editMode={editMode}
          loading={loading}
          onEdit={() => setEditMode(true)}
          onCancel={() => setEditMode(false)}
          onSave={form.handleSubmit(onSubmit)}
        />
      </div>
      <Form {...form}>
        <div className="flex flex-col gap-6">
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                {editMode ? (
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                ) : (
                  <p className="text-sm text-muted-foreground">{field.value}</p>
                )}
              </FormItem>
            )}
          />

          <Separator />

          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                {editMode ? (
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                ) : (
                  <p className="text-sm text-muted-foreground">{field.value}</p>
                )}
              </FormItem>
            )}
          />

          <Separator />
          <FormLabel>Contraseña</FormLabel>

          {editMode && (
            <>
              <div className="font-semibold mb-2">Contraseña</div>
              <FormField
                name="newPassword"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nueva contraseña</FormLabel>
                    <FormControl>
                      <Input type="password" autoComplete="new-password" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name="confirmPassword"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar contraseña</FormLabel>
                    <FormControl>
                      <Input type="password" autoComplete="new-password" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </>
          )}
        </div>
      </Form>
    </div>
  );
}
