'use client'

import { useEffect, useState, useTransition } from 'react'
import { Mail, Trash2, Shield, ShieldCheck, ChevronDown, ChevronUp, Check, Send } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { inviterAdmin, fjernAdmin, oppdaterRolle, settPakkeTilgang, sendInvitasjonPaNytt } from '@/app/admin/brukere/actions'
import { useConfirm } from '@/components/admin/confirm-modal'
import type { AdminRolle } from '@/hooks/use-admin-role'

interface AdminBruker {
  id: string
  user_id: string
  rolle: AdminRolle
  epost: string
  passord_satt: boolean
}

interface Pakke {
  id: string
  navn: string
  farge: string
}

interface PakkeTilgang {
  bruker_id: string
  spillpakke_id: string
}

export function UserManagement({ currentUserId }: { currentUserId: string }) {
  const [brukere, setBrukere] = useState<AdminBruker[]>([])
  const [pakker, setPakker] = useState<Pakke[]>([])
  const [tilgang, setTilgang] = useState<PakkeTilgang[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteNavn, setInviteNavn] = useState('')
  const [inviteRolle, setInviteRolle] = useState<AdminRolle>('admin')
  const [inviting, startInvite] = useTransition()
  const [inviteMsg, setInviteMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)
  const [actionMsg, setActionMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  const [pending, startAction] = useTransition()
  const { confirm, ConfirmDialog } = useConfirm()

  async function load() {
    const supabase = createClient()

    const [{ data: b }, { data: p }, { data: t }] = await Promise.all([
      supabase.from('admin_brukere').select('*').order('opprettet_at'),
      supabase.from('spillpakker').select('id, navn, farge').order('opprettet_at'),
      supabase.from('pakke_tilgang').select('bruker_id, spillpakke_id'),
    ])

    setBrukere((b as AdminBruker[]) ?? [])
    setPakker(p ?? [])
    setTilgang(t ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function hasTilgang(brukerId: string, pakkeid: string) {
    return tilgang.some(t => t.bruker_id === brukerId && t.spillpakke_id === pakkeid)
  }

  function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    setInviteMsg(null)
    startInvite(async () => {
      const res = await inviterAdmin(inviteEmail, inviteRolle, inviteNavn)
      if (res.error) {
        setInviteMsg({ type: 'err', text: res.error })
      } else {
        setInviteMsg({ type: 'ok', text: `Invitasjon sendt til ${inviteNavn || inviteEmail}!` })
        setInviteEmail('')
        setInviteNavn('')
        await load()
      }
    })
  }

  async function handleFjern(userId: string) {
    const ok = await confirm({ title: 'Fjern admin-bruker?', message: 'Brukeren mister tilgang til admin umiddelbart.', confirmLabel: 'Fjern', danger: true })
    if (!ok) return
    startAction(async () => {
      await fjernAdmin(userId)
      await load()
    })
  }

  function handleRolle(userId: string, rolle: AdminRolle) {
    startAction(async () => {
      await oppdaterRolle(userId, rolle)
      await load()
    })
  }

  function handleResend(userId: string, epost: string, rolle: AdminRolle) {
    setActionMsg(null)
    startAction(async () => {
      const res = await sendInvitasjonPaNytt(userId, epost, rolle, epost)
      if (res.error) {
        setActionMsg({ type: 'err', text: res.error })
      } else {
        setActionMsg({ type: 'ok', text: `Invitasjon sendt til ${epost}` })
      }
    })
  }

  function handleTilgang(brukerId: string, pakkeid: string, har: boolean) {
    startAction(async () => {
      await settPakkeTilgang(brukerId, pakkeid, !har)
      await load()
    })
  }

  const inputCls = 'px-4 py-2.5 bg-cream border border-cream-dark/60 rounded-xl text-forest text-sm focus:outline-none focus:border-forest/40 transition-colors'

  return (
    <div className="space-y-8">
      {ConfirmDialog}

      {/* Invite form */}
      <div className="bg-white rounded-2xl p-6 border border-cream-dark/40">
        <h2 className="font-display font-black text-xl text-forest mb-4">Inviter ny admin</h2>
        <form onSubmit={handleInvite} className="space-y-3">
          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-48">
              <label className="block text-xs font-bold text-forest/50 uppercase tracking-wider mb-1.5">
                Fullt navn
              </label>
              <input
                type="text"
                required
                value={inviteNavn}
                onChange={e => setInviteNavn(e.target.value)}
                className={inputCls + ' w-full'}
                placeholder="Ola Nordmann"
              />
            </div>
            <div className="flex-1 min-w-48">
              <label className="block text-xs font-bold text-forest/50 uppercase tracking-wider mb-1.5">
                E-post
              </label>
              <input
                type="email"
                required
                value={inviteEmail}
                onChange={e => setInviteEmail(e.target.value)}
                className={inputCls + ' w-full'}
                placeholder="bruker@epost.no"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-3 items-end">
            <div>
              <label className="block text-xs font-bold text-forest/50 uppercase tracking-wider mb-1.5">
                Rolle
              </label>
              <select
                value={inviteRolle}
                onChange={e => setInviteRolle(e.target.value as AdminRolle)}
                className={inputCls}
              >
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={inviting}
              className="inline-flex items-center gap-2 bg-forest text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-forest/80 active:scale-95 disabled:opacity-50 transition-all"
            >
              <Mail className="w-4 h-4" />
              {inviting ? 'Sender...' : 'Send invitasjon'}
            </button>
          </div>
        </form>
        {inviteMsg && (
          <p className={`text-sm font-medium mt-3 ${inviteMsg.type === 'ok' ? 'text-green-600' : 'text-red-500'}`}>
            {inviteMsg.text}
          </p>
        )}
      </div>

      {actionMsg && (
        <p className={`text-sm font-medium px-1 ${actionMsg.type === 'ok' ? 'text-green-600' : 'text-red-500'}`}>
          {actionMsg.text}
        </p>
      )}

      {/* User list */}
      <div className="bg-white rounded-2xl border border-cream-dark/40 overflow-hidden">
        <div className="px-6 py-4 border-b border-cream-dark/40">
          <h2 className="font-display font-black text-xl text-forest">Admin-brukere</h2>
        </div>

        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(2)].map((_, i) => <div key={i} className="h-14 bg-cream rounded-xl animate-pulse" />)}
          </div>
        ) : brukere.length === 0 ? (
          <p className="p-6 text-forest/40 text-sm">Ingen admin-brukere enda.</p>
        ) : (
          <div className="divide-y divide-cream-dark/30">
            {brukere.map(bruker => {
              const isSelf = bruker.user_id === currentUserId
              const isExpanded = expandedId === bruker.user_id
              const isSuperAdmin = bruker.rolle === 'super_admin'

              return (
                <div key={bruker.user_id}>
                  {/* Row */}
                  <div className="flex items-center gap-4 px-6 py-4">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isSuperAdmin ? 'bg-lime' : 'bg-cream-dark/40'}`}>
                      {isSuperAdmin
                        ? <ShieldCheck className="w-4 h-4 text-forest" />
                        : <Shield className="w-4 h-4 text-forest/40" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-forest text-sm truncate">{bruker.epost}</p>
                      <p className="text-xs text-forest/40 font-medium">
                        {isSuperAdmin ? 'Super Admin' : 'Admin'}
                        {isSelf && ' (deg)'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Role toggle */}
                      {!isSelf && (
                        <button
                          onClick={() => handleRolle(bruker.user_id, isSuperAdmin ? 'admin' : 'super_admin')}
                          disabled={pending}
                          className="text-xs font-bold text-forest/50 hover:text-forest px-3 py-1.5 rounded-lg hover:bg-cream transition-colors border border-cream-dark/60"
                        >
                          → {isSuperAdmin ? 'Admin' : 'Super'}
                        </button>
                      )}

                      {/* Resend invite — only shown if user hasn't set password yet */}
                      {!isSelf && !bruker.passord_satt && (
                        <button
                          onClick={() => handleResend(bruker.user_id, bruker.epost, bruker.rolle)}
                          disabled={pending}
                          title="Send invitasjon på nytt"
                          className="text-xs font-bold text-forest/50 hover:text-forest px-3 py-1.5 rounded-lg hover:bg-cream transition-colors border border-cream-dark/60 inline-flex items-center gap-1"
                        >
                          <Send className="w-3 h-3" />
                        </button>
                      )}

                      {/* Pack access toggle (only for regular admins) */}
                      {!isSuperAdmin && (
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : bruker.user_id)}
                          className="text-xs font-bold text-forest/50 hover:text-forest px-3 py-1.5 rounded-lg hover:bg-cream transition-colors border border-cream-dark/60 inline-flex items-center gap-1"
                        >
                          Pakker
                          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                      )}

                      {/* Remove */}
                      {!isSelf && (
                        <button
                          onClick={() => handleFjern(bruker.user_id)}
                          disabled={pending}
                          className="text-red-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Pack access panel */}
                  {isExpanded && !isSuperAdmin && (
                    <div className="px-6 pb-4 bg-cream/50 border-t border-cream-dark/30">
                      <p className="text-xs font-bold text-forest/40 uppercase tracking-wider pt-4 mb-3">
                        Pakketilgang
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {pakker.map(pakke => {
                          const har = hasTilgang(bruker.user_id, pakke.id)
                          return (
                            <button
                              key={pakke.id}
                              onClick={() => handleTilgang(bruker.user_id, pakke.id, har)}
                              disabled={pending}
                              className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all border-2 ${
                                har
                                  ? 'border-forest bg-forest text-white'
                                  : 'border-cream-dark/60 bg-white text-forest/50 hover:border-forest/30'
                              }`}
                            >
                              <span
                                className="w-3 h-3 rounded-sm shrink-0"
                                style={{ backgroundColor: pakke.farge }}
                              />
                              {pakke.navn}
                              {har && <Check className="w-3 h-3" />}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
