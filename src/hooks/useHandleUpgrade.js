import { useMutation } from "@tanstack/react-query";

export function useHandleUpgrade(user) {
  return useMutation({
    mutationFn: async () => {
      if (!user?.uid || !user?.email) throw new Error("Faltan datos del usuario");

      const response = await fetch("/api/create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.uid, email: user.email }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error en la respuesta: ${errorText}`);
      }

      return response.json();
    },
    onSuccess: (data) => {
      if (data.subscriptionUrl) {
        window.location.href = data.subscriptionUrl;
      }
    },
    onError: (error) => {
      console.error("❌ Error en la suscripción:", error);
    },
  });
}
