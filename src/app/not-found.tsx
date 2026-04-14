import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-dvh bg-lime flex flex-col items-center justify-center text-forest p-6 text-center">
      <div className="text-7xl mb-4" aria-hidden>🥂</div>
      <h1 className="font-display font-black text-5xl mb-3">Siden finnes ikke</h1>
      <p className="text-forest/70 mb-8 max-w-md">
        Denne siden har enten drukket seg i svime, eller den har aldri eksistert.
        Uansett — la oss få deg tilbake til festen.
      </p>
      <Link
        href="/"
        className="bg-forest text-lime font-black px-6 py-3 rounded-2xl hover:opacity-90 transition"
      >
        Tilbake til Klink
      </Link>
    </main>
  )
}
