"use server";
import { Resend } from "resend";

export async function sendEmail({ to, subject, html }) {
  const apiKey = process.env.RESEND_API_KEY; // se lee dentro de la función
  if (!apiKey) throw new Error("Missing RESEND_API_KEY");

  const resend = new Resend(apiKey);
  return resend.emails.send({
    from: "La Citadel <no-reply@lacitadel.com.ar>",
    to,
    subject,
    html,
  });
}
