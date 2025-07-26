export function subscriptionCancelledEmail(user) {
    return {
      subject: "Tu suscripción fue cancelada",
      html: `
        <p>Hola ${user.name},</p>
        <p>Tu suscripción PRO ha sido cancelada. Podés reactivarla en cualquier momento desde el panel.</p>
      `,
    };
  }
  