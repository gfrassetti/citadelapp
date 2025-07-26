import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({ to, subject, html }) {
  return resend.emails.send({
    from: 'La Citadel <no-reply@lacitadel.com.ar>',
    to,
    subject,
    html,
  });
}
