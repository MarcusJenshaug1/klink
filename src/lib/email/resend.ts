import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = process.env.RESEND_FROM ?? 'Klink <onboarding@resend.dev>'

export async function sendAdminInvite({
  to,
  navn,
  inviteLink,
  rolle,
}: {
  to: string
  navn: string
  inviteLink: string
  rolle: 'admin' | 'super_admin'
}) {
  const fornavn = navn.split(' ')[0]
  const rolleLabel = rolle === 'super_admin' ? 'Super Admin' : 'Admin'

  const html = `<!DOCTYPE html>
<html lang="no">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Du er invitert til Klink!</title>
</head>
<body style="margin:0;padding:0;background:#1A3A1A;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,sans-serif;">

  <!-- Outer wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#1A3A1A;padding:48px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:540px;">

          <!-- Logo / header -->
          <tr>
            <td align="center" style="padding-bottom:36px;">
              <div style="display:inline-block;background:#A8E63D;border-radius:22px;padding:14px 38px;">
                <span style="font-family:'Playfair Display',Georgia,'Times New Roman',serif;font-weight:900;font-size:44px;color:#1A3A1A;letter-spacing:-1px;line-height:1;">Klink</span>
              </div>
            </td>
          </tr>

          <!-- Main card -->
          <tr>
            <td style="background:#F5F2EC;border-radius:24px;padding:44px 40px 40px;border:1px solid rgba(255,255,255,0.06);">

              <!-- Greeting -->
              <h1 style="margin:0 0 8px;font-size:28px;font-weight:900;color:#1A3A1A;line-height:1.2;letter-spacing:-0.5px;">
                Hei ${fornavn}! 🎉
              </h1>
              <p style="margin:0 0 24px;font-size:17px;font-weight:700;color:#1A3A1A;line-height:1.4;">
                Du er invitert til å styre Klink!
              </p>

              <!-- Body -->
              <p style="margin:0 0 12px;font-size:15px;color:#1A3A1A99;line-height:1.65;">
                Nå kan du lage ditt eget drikkespill, bygg spillpakker, lag morsomme kort og del opplevelsen med vennene dine. Alt administreres enkelt i Klink Admin.
              </p>
              <p style="margin:0 0 32px;font-size:15px;color:#1A3A1A99;line-height:1.65;">
                Du er invitert som <strong style="color:#1A3A1A;">${rolleLabel}</strong>. Klikk på knappen under for å sette opp din konto, skål! 🍺
              </p>

              <!-- CTA -->
              <table cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <a href="${inviteLink}"
                      style="display:inline-block;background:#1A3A1A;color:#D4F04C;text-decoration:none;font-weight:800;font-size:16px;padding:16px 42px;border-radius:16px;letter-spacing:0.2px;line-height:1;">
                      Godta invitasjon →
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <hr style="border:none;border-top:1px solid #1A3A1A18;margin:36px 0 24px;" />

              <!-- Fine print -->
              <p style="margin:0;font-size:12px;color:#1A3A1A44;line-height:1.6;text-align:center;">
                Lenken er gyldig i 24 timer.<br/>
                Hvis du ikke forventet denne invitasjonen kan du trygt se bort fra e-posten.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:28px;">
              <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.25);line-height:1.6;">
                Klink &mdash; drikkelek for alle
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`

  return resend.emails.send({
    from: FROM,
    to,
    subject: `Hei ${fornavn}! Du er invitert til å styre Klink 🎉`,
    html,
  })
}
