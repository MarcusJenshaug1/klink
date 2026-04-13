import { LoginForm } from '@/components/admin/login-form'

export default function AdminLoginPage() {
  return (
    <div className="min-h-dvh bg-forest flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-display font-black text-5xl text-lime leading-none mb-2">
            Klink
          </h1>
          <p className="text-white/50 text-sm font-medium">Admin</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
