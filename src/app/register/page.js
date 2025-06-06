"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { auth } from "../../lib/db/db.js";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Form, FormField, FormItem, FormLabel, FormControl, FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import clsx from "clsx";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const db = getFirestore();

const schema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

export default function RegisterPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const form = useForm({ resolver: zodResolver(schema), mode: "onChange" });

  const onSubmit = async (data) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: data.name });

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        name: data.name,
        plan: "free",
        createdAt: new Date(),
      });

      await auth.signOut();
      localStorage.setItem("registerSuccess", "true");
      router.push("/login");
    } catch (error) {
      console.error("❌ Error al registrar:", error.message);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-[calc(100vh-150px)] px-4 py-8">
      <div className={clsx(
        "w-full max-w-md p-6 rounded-3xl shadow-xl border",
        theme === "dark" ? "bg-gray-900 text-white border-[#06f388]" : "bg-white text-black border-gray-200"
      )}>
        <h1 className="text-2xl font-semibold mb-4 text-center">Crea tu cuenta</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField name="name" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField name="email" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} placeholder="Email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField name="password" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Contraseña</FormLabel>
                <FormControl>
                  <Input type="password" {...field} placeholder="Password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField name="confirmPassword" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmar Contraseña</FormLabel>
                <FormControl>
                  <Input type="password" {...field} placeholder="Confirm Password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 transition">
              Registrarse
            </Button>
          </form>
        </Form>
        <p className="text-center text-sm mt-4">
          Ya tienes cuenta?{" "}
          <Link href="/login" className="text-blue-500 hover:underline">Ingresa</Link>
        </p>
      </div>
    </main>
  );
}
