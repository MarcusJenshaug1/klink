import { LoginForm } from '@/components/admin/login-form'

export default function AdminLoginPage() {
  return (
    <div className="min-h-dvh bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-6">Klink Admin</h1>
        <div className="bg-white rounded-xl shadow-md p-6">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
