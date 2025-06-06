"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTheme } from "next-themes";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, googleProvider, db } from "../../lib/db/db.js";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import Loader from "@/components/Loader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";

const schema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Debe tener al menos 6 caracteres"),
});

export default function LoginForm() {
  const [isResetPassword, setIsResetPassword] = useState(false);
  const router = useRouter();
  const { theme } = useTheme();
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  useEffect(() => {
    setPersistence(auth, browserSessionPersistence).catch((err) =>
      console.error("❌ Error persistencia:", err)
    );
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) router.push("/dashboard");
      else setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (localStorage.getItem("registerSuccess") === "true") {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      localStorage.removeItem("registerSuccess");
    }
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      router.push("/dashboard");
    } catch {
      setError("Credenciales inválidas. Intenta nuevamente.");
      setLoading(false);
    }
  };

  const handleResetPassword = async (data) => {
    try {
      await sendPasswordResetEmail(auth, data.email);
      setShowSuccess(true);
    } catch (error) {
      console.error("Reset error:", error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        await setDoc(ref, {
          uid: user.uid,
          email: user.email,
          name: user.displayName,
          photoURL: user.photoURL,
          plan: "free",
          createdAt: new Date(),
        });
      }
      router.push("/dashboard");
    } catch (error) {
      console.error("Google login error:", error);
      setError("No se pudo iniciar sesión con Google");
      setLoading(false);
    }
  };

  if (loading) return <Loader text="" />;

  return (
    <div className={`flex flex-col items-center h-screen w-full ${theme === "dark" ? "bg-gray-600" : "bg-gray-100"}`}>
      <div className="bg-white p-6 my-auto text-center rounded-3xl shadow-md w-full max-w-md justify-center items-center mx-auto">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-2">
          {isResetPassword ? "Recuperar contraseña" : "Bienvenido de nuevo"}
        </h2>

        {showSuccess && (
          <Alert variant="success" className="mb-4">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <AlertTitle>Registro exitoso</AlertTitle>
            <AlertDescription>Ahora puedes iniciar sesión.</AlertDescription>
          </Alert>
        )}

        {!isResetPassword && (
          <>
            <span className="py-2 block">Inicie sesión con su cuenta de Google</span>
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="rounded-full mx-auto px-4 py-2 text-sm font-normal text-black border solid flex"
            >
              <Image src="/assets/google-logo.png" alt="Google" width={20} height={20} className="mr-4" />
              Iniciar sesión con Google
            </button>
            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border py-4">
              <span className="relative z-10 bg-background px-2 text-muted-foreground bg-white">Or continue with</span>
            </div>
          </>
        )}

        {isResetPassword ? (
          <form onSubmit={handleSubmit(handleResetPassword)} className="flex flex-col gap-4">
            <Label htmlFor="email">Ingrese su email para restablecer contraseña</Label>
            <input {...register("email")} placeholder="Email" className="input" />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            <button type="submit" className="btn">Enviar enlace de recuperación</button>
            <button type="button" onClick={() => setIsResetPassword(false)} className="text-sm text-blue-500 hover:underline">Volver al login</button>
          </form>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Label>Email</Label>
            <input {...register("email")} placeholder="Email" className="input" />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            <div className="flex items-center">
              <Label>Password</Label>
              <button type="button" onClick={() => setIsResetPassword(true)} className="ml-auto text-sm underline-offset-2 hover:underline">¿Olvidaste tu contraseña?</button>
            </div>
            <input {...register("password")} type="password" placeholder="Password" className="input" />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            <button type="submit" className="btn">Acceso</button>
            {error && <p className="text-red-500">{error}</p>}
            <div className="text-sm text-center">
              Don&apos;t have an account? <a href="/register" className="underline">Sign up</a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
