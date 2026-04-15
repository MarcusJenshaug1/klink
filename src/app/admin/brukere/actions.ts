'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendAdminInvite } from '@/lib/email/resend'
import type { AdminRolle } from '@/hooks/use-admin-role'

function getAppUrl() {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL
  if (process.env.NODE_ENV === 'production') return 'https://www.klinkn.no'
  return 'http://localhost:3000'
}

async function verifySuperAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('admin_brukere')
    .select('rolle')
    .eq('user_id', user.id)
    .single()

  return data?.rolle === 'super_admin' ? user : null
}

export async function inviterAdmin(epost: string, rolle: AdminRolle = 'admin', navn: string = '') {
  const user = await verifySuperAdmin()
  if (!user) return { error: 'Ikke tilgang — kun super admin kan invitere brukere' }

  const admin = createAdminClient()
  const appUrl = getAppUrl()

  // Generate invite link without sending Supabase's default email
  const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
    type: 'invite',
    email: epost,
    options: {
      redirectTo: `${appUrl}/admin/auth/callback`,
      data: { full_name: navn },
    },
  })

  if (linkError) return { error: linkError.message }

  // Record in admin_brukere
  const { error: insertError } = await admin.from('admin_brukere').insert({
    user_id: linkData.user.id,
    rolle,
    epost,
    navn: navn || null,
  })

  if (insertError) return { error: insertError.message }

  // Send branded invite email via Resend
  const { error: emailError } = await sendAdminInvite({
    to: epost,
    navn: navn || epost,
    inviteLink: linkData.properties.action_link,
    rolle,
  })

  if (emailError) return { error: `Bruker opprettet, men e-post feilet: ${emailError.message}` }

  return { success: true }
}

export async function markerPassordSatt() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Ikke innlogget' }

  const admin = createAdminClient()
  await admin.from('admin_brukere').update({ passord_satt: true }).eq('user_id', user.id)
  return { success: true }
}

export async function sendInvitasjonPaNytt(userId: string, epost: string, rolle: AdminRolle, navn: string) {
  const user = await verifySuperAdmin()
  if (!user) return { error: 'Ikke tilgang' }

  const admin = createAdminClient()
  const appUrl = getAppUrl()

  const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
    type: 'magiclink',
    email: epost,
    options: { redirectTo: `${appUrl}/admin/auth/callback` },
  })

  if (linkError) return { error: linkError.message }

  const { error: emailError } = await sendAdminInvite({
    to: epost,
    navn: navn || epost,
    inviteLink: linkData.properties.action_link,
    rolle,
  })

  if (emailError) return { error: `E-post feilet: ${emailError.message}` }
  return { success: true }
}

export async function fjernAdmin(userId: string) {
  const user = await verifySuperAdmin()
  if (!user) return { error: 'Ikke tilgang' }
  if (userId === user.id) return { error: 'Du kan ikke fjerne deg selv' }

  const admin = createAdminClient()
  await admin.from('admin_brukere').delete().eq('user_id', userId)
  // Also delete from Supabase Auth so the email can be re-invited later
  await admin.auth.admin.deleteUser(userId)

  return { success: true }
}

export async function oppdaterRolle(userId: string, rolle: AdminRolle) {
  const user = await verifySuperAdmin()
  if (!user) return { error: 'Ikke tilgang' }
  if (userId === user.id) return { error: 'Du kan ikke endre din egen rolle' }

  const admin = createAdminClient()
  const { error } = await admin
    .from('admin_brukere')
    .update({ rolle })
    .eq('user_id', userId)

  if (error) return { error: error.message }
  return { success: true }
}

export async function settPakkeTilgang(brukerId: string, pakkeid: string, harTilgang: boolean) {
  const user = await verifySuperAdmin()
  if (!user) return { error: 'Ikke tilgang' }

  const admin = createAdminClient()

  if (harTilgang) {
    const { error } = await admin.from('pakke_tilgang').insert({
      bruker_id: brukerId,
      spillpakke_id: pakkeid,
    })
    if (error && !error.message.includes('duplicate')) return { error: error.message }
  } else {
    await admin
      .from('pakke_tilgang')
      .delete()
      .eq('bruker_id', brukerId)
      .eq('spillpakke_id', pakkeid)
  }

  return { success: true }
}
