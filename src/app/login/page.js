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
  browserSessionPersistence
} from "firebase/auth";
import Image from "next/image";
import { useEffect, useState } from "react";
import { auth, googleProvider } from "../../lib/db/db.js";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";

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
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  // 🔹 Establecer persistencia de sesión en browserSessionPersistence
  useEffect(() => {
    setPersistence(auth, browserSessionPersistence).then(() => {
      console.log("🔐 Persistencia de sesión establecida en SESSION");
    }).catch((error) => {
      console.error("❌ Error al configurar la persistencia:", error);
    });
  }, []);

  /* Auth */
  const onSubmit = async (data) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      console.log("✅ Usuario logueado:", userCredential.user);
      router.push("/dashboard"); // 🔹 Redirigir al dashboard tras login exitoso
    } catch (error) {
      setError("Credenciales inválidas. Intenta nuevamente.")
    }
  };

  /* Password Reset */
  const handleResetPassword = async (data) => {
    try {
      await sendPasswordResetEmail(auth, data.email);
      console.log("Reset Email sent");
      setShowSuccess(true);
    } catch (error) {
      console.error("Error al enviar el correo de restablecimiento:", error.message);
    }
  };

  /* Prevenir login redirect si user loggeado */
  useEffect(() => {
    const isComingFromRegister = localStorage.getItem("registerSuccess");
  
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && !isComingFromRegister) {
        router.push("/dashboard");
      } else {
        setLoading(false);
      }
    });
  
    return () => unsubscribe();
  }, [router]);

  // Eliminar para que no se muestre en futuros inicios de sesión
  useEffect(() => {
    if (localStorage.getItem("registerSuccess") === "true") {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      localStorage.removeItem("registerSuccess");
    }
  }, []);

  /* Google auth */
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("✅ Usuario con Google:", result.user);
    } catch (error) {
      console.error("❌ Error con Google:", error.message);
    }
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <div className={`flex flex-col items-center h-screen w-full ${ theme === "dark" ? "bg-gray-600" : "bg-gray-100"}`}>
      <div className="bg-white p-6 my-auto text-center rounded-3xl shadow-md w-full max-w-md justify-center items-center mx-auto">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-2">
          {isResetPassword ? "Recuperar contraseña" : "Bienvenido de nuevo"}
        </h2>
        {showSuccess && (<span className="text-green-500">Registro existoso</span>)}
        {!isResetPassword && (
          <>
            <span className="py-2 block">Inicie sesión con su cuenta de Google</span>
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="rounded-full mx-auto px-4 py-2 text-sm font-normal text-black border solid flex"
            >
              <Image src="/assets/google-logo.png" alt="Logo de Mi App" width={20} height={20} className="mr-4" />
              Iniciar sesión con Google
            </button>
            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border py-4">
              <span className="relative z-10 bg-background px-2 text-muted-foreground bg-white">
                Or continue with
              </span>
            </div>
          </>
        )}
  
        {isResetPassword ? (
          <form onSubmit={handleSubmit(handleResetPassword)} className="flex flex-col gap-4">
            <div className="flex items-center">
              <Label htmlFor="email">Ingrese su email para restablecer contraseña</Label>
            </div> 
            <input {...register("email")} placeholder="Email" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
  
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
              Enviar enlace de recuperación
            </button>
            <button type="button" onClick={() => setIsResetPassword(false)} className="mt-2 text-sm text-blue-500 hover:underline">
              Volver al login
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="flex items-center">
              <Label htmlFor="email">Email</Label>
            </div> 
            <input {...register("email")} placeholder="Email" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
  
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <button type="button" onClick={() => setIsResetPassword(true)} className="ml-auto text-sm underline-offset-2 hover:underline">
                ¿Olvidaste tu contraseña?
              </button>
            </div>                  
            <input {...register("password")} type="password" placeholder="Password" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
  
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">Acceso</button>
            {error && <p className="text-red-500" id="login-error">{error}</p>}
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="/register" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
