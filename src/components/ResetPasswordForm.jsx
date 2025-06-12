"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";
import { auth, sendPasswordResetEmail } from "@/lib/db/db";

export default function ResetPasswordForm({ onBack }) {
  const [resetEmail, setResetEmail] = useState("");
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleResetPassword = async () => {
    if (!resetEmail) {
      setError("Ingresá un email válido.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setError("");
      setResetEmail("");
      setShowSuccess(true);
      localStorage.setItem("resetSuccess", "true");
      setTimeout(() => {
        onBack();
      }, 1500);
    } catch (error) {
      setError("No se pudo enviar el correo. ¿El email está registrado?");
    }
  };

  return (
    <>
      {showSuccess && (
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

      <div className="flex flex-col gap-4">
        <Label htmlFor="reset-email">Ingrese su email para restablecer contraseña</Label>
        <Input
          id="reset-email"
          type="email"
          value={resetEmail}
          onChange={(e) => setResetEmail(e.target.value)}
          placeholder="Email"
        />
        <Button className="btn" onClick={handleResetPassword}>Enviar</Button>
        <Button
          variant="link"
          className="text-xs text-blue-800 hover:underline"
          onClick={onBack}
        >
          Volver al login
        </Button>
      </div>
    </>
  );
}
