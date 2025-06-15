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
import UserInfoActions from "@/components/UserInfoActions";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Loader2Icon, PencilIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
  const [success, setSuccess] = useState(false);

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

      if (values.newPassword) await updatePassword(user, values.newPassword);

      setCurrentAvatarUrl(avatarUrl);
      setSuccess(true);
      setEditMode(false);
      setTimeout(() => setSuccess(false), 5000);

      reset({
        ...values,
        avatar: null,
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleRemoveAvatar() {
    const user = auth.currentUser;
    if (!user || !currentAvatarUrl) return;
    await deleteObject(ref(storage, currentAvatarUrl));
    await updateDoc(doc(db, "users", user.uid), { avatarUrl: "" });
    setCurrentAvatarUrl("");
  }

  return (
    <div className="flex flex-col gap-6 px-6 md:px-16 py-10">
      <UserInfoActions
        editMode={editMode}
        loading={loading}
        onEdit={() => setEditMode(true)}
        onCancel={() => setEditMode(false)}
        onSave={form.handleSubmit(onSubmit)}
      />
      {success && (
        <Alert variant="success">
          <AlertTitle>Perfil actualizado</AlertTitle>
          <AlertDescription>Tus datos se han guardado correctamente.</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <div className="flex flex-col gap-6">
          <Separator />
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
          <FormField
            name="avatar"
            control={form.control}
            render={({ field }) => (
              editMode && (
                <FormItem>
                  <FormLabel>Avatar</FormLabel>
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
                </FormItem>
              )
            )}
          />

          <Separator />
          {editMode && (
            <>
              <FormField
                name="newPassword"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nueva Contraseña</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name="confirmPassword"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar Contraseña</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Separator />
            </>
          )}
        </div>
      </Form>
    </div>
  );
}
