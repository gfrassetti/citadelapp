import { useMutation } from "@tanstack/react-query";
import { getAuth } from "firebase/auth";

export function useHandleUpgrade() {
  return useMutation({
    mutationFn: async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) throw new Error("Usuario no autenticado");

      const token = await user.getIdToken();

      const response = await fetch("/api/stripe/create-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error en la respuesta: ${errorText}`);
      }

      return response.json();
    },
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error) => {
      console.error("❌ Error en la suscripción:", error);
    },
  });
}
