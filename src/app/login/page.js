"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTheme } from "next-themes";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  setPersistence,
  browserSessionPersistence,
} from "@/lib/db/db";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, googleProvider, db } from "@/lib/db/db";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import FullScreenLoader from "@/components/FullScreenLoader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ResetPasswordForm from "@/components/ResetPasswordForm";
import { CheckCircle2 } from "lucide-react";
import clsx from "clsx";

const schema = z.object({
  email: z.string().email("Email inválido").optional(),
  password: z.string().min(6, "Debe tener al menos 6 caracteres").optional(),
});

export default function LoginForm() {
  const [isResetPassword, setIsResetPassword] = useState(false);
  const router = useRouter();
  const { theme } = useTheme();
  const [showRegisterSuccess, setShowRegisterSuccess] = useState(false);
  const [showResetSuccess, setShowResetSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

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
      setShowRegisterSuccess(true);
      setTimeout(() => setShowRegisterSuccess(false), 3000);
      localStorage.removeItem("registerSuccess");
    }
    if (localStorage.getItem("resetSuccess") === "true") {
      setShowResetSuccess(true);
      setTimeout(() => setShowResetSuccess(false), 3000);
      localStorage.removeItem("resetSuccess");
    }
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      router.push("/dashboard");
    } catch {
      setError("Credenciales inválidas. Intenta nuevamente.");
      setLoading(false);
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

  if (loading) return <FullScreenLoader />;

  return (
    <div className={`flex flex-col items-center h-screen w-full px-4 ${theme === "dark" ? "bg-gray-600" : "bg-gray-100"}`}>
      <div className={`${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"} p-6 my-auto text-center rounded-3xl shadow-md w-full max-w-md justify-center items-center mx-auto`}>
        <h2 className={`text-2xl font-semibold text-center mb-2 ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
          {isResetPassword ? "Recuperar contraseña" : "Bienvenido de nuevo"}
        </h2>
  
        {isResetPassword ? (
          <ResetPasswordForm onBack={() => setIsResetPassword(false)} />
        ) : (
          <>
            {showRegisterSuccess && (
              <Alert variant="success" className="mb-4">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <AlertTitle>Registro exitoso</AlertTitle>
                <AlertDescription>Ahora puedes iniciar sesión.</AlertDescription>
              </Alert>
            )}
            {showResetSuccess && (
              <Alert variant="success" className="mb-4">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <AlertTitle>Email enviado</AlertTitle>
                <AlertDescription>Revisa tu bandeja de entrada para restablecer tu contraseña.</AlertDescription>
              </Alert>
            )}
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
  
            <span className={`py-2 block ${theme === "dark" ? "text-white" : ""}`}>
              Inicie sesión con su cuenta de Google
            </span>
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className={clsx(
                "rounded-full mx-auto px-4 py-2 text-sm font-normal border solid flex transition-colors ease-in-out duration-150",
                theme === "dark"
                  ? "text-white bg-gray-700 hover:bg-gray-600"
                  : "text-black hover:bg-gray-300"
              )}            >
              <Image src="/assets/google-logo.png" alt="Google" width={20} height={20} className="mr-4" />
              Iniciar sesión con Google
            </button>
  
            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border py-4">
              <span className={`relative z-10 px-2 ${theme === "dark" ? "bg-gray-800 text-gray-400" : "bg-white text-muted-foreground"}`}>
                O continua con
              </span>
            </div>
  
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col text-left gap-4">
              <Label className={theme === "dark" ? "text-white" : ""}>Email</Label>
              <Input {...register("email")} placeholder="Email" />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
              <div className="flex items-center">
                <Label className={theme === "dark" ? "text-white" : ""}>Contraseña</Label>
                <button
                  type="button"
                  onClick={() => setIsResetPassword(true)}
                  className="ml-auto text-sm underline-offset-2 hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
              <Input {...register("password")} type="password" placeholder="Contraseña" />
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
              <Button type="submit" className="btn">Acceso</Button>
              <div className={`text-sm text-center ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                No tenes una cuenta?{" "}
                <a href="/register" className="underline hover:text-blue-600">Registrate</a>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
