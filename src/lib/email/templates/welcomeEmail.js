export function welcomeEmail(user) {
    return {
      subject: "¡Bienvenido a La Citadel!",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
          <h2>Hola ${user.name},</h2>
          <p>Gracias por registrarte en <strong>La Citadel</strong>.</p>
          <p>Ya podés acceder a tu panel de usuario y comenzar a explorar las funciones disponibles.</p>
          <br/>
          <p>¡Bienvenido a bordo!</p>
        </div>
      `,
    };
  }
  