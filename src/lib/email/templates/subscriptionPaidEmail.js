export function subscriptionPaidEmail(user) {
    return {
      subject: "¡Gracias por suscribirte a PRO!",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
          <h2>Hola ${user.name},</h2>
          <p>Tu suscripción <strong>PRO</strong> ha sido activada exitosamente.</p>
          <p>Ahora tenés acceso completo al panel premium, podés subir y editar tus productos, y aparecer en la búsqueda pública.</p>
          <br/>
          <p>¡Aprovechá al máximo tu cuenta PRO!</p>
        </div>
      `,
    };
  }
  