export function subscriptionPausedEmail(user) {
    return {
      subject: "Tu suscripción fue pausada",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
          <h2>Hola ${user.name},</h2>
          <p>Tu suscripción <strong>PRO</strong> fue pausada.</p>
          <p>Durante este tiempo, perderás acceso a las funcionalidades premium del panel.</p>
          <br/>
          <p>Podés reactivarla en cualquier momento desde tu perfil.</p>
        </div>
      `,
    };
  }
  