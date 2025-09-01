import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getSubscriptionLabel(subscription) {
  if (!subscription) return "-";
  const status = subscription.status;
  const trialEnd = subscription.trial_end ? new Date(subscription.trial_end * 1000) : null;

  if (status === "trialing" && trialEnd) {
    const now = new Date();
    const diffMs = trialEnd - now;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return `Prueba Gratuita (${diffDays} días restantes)`;
  }

  if (status === "trialing") return "Prueba Gratuita";

  if (status === "active") return "Activa";

  if (status === "canceled") return "Cancelada";

  if (status === "paused") return "Pausada";

  return status;
}
