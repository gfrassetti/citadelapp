export function subscriptionReactivatedEmail(user) {
    return {
      subject: "¡Tu suscripción fue reactivada!",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
          <h2>Hola ${user.name},</h2>
          <p>Tu suscripción <strong>PRO</strong> ha sido reactivada.</p>
          <p>Ya tenés nuevamente acceso completo al panel premium.</p>
          <br/>
          <p>¡Gracias por seguir confiando en La Citadel!</p>
        </div>
      `,
    };
  }
  