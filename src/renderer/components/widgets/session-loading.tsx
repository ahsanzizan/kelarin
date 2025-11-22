import { Loader2 } from 'lucide-react'

export function SessionLoading() {
  return (
    <main className="flex h-screen items-center justify-center bg-black">
      <div className="flex items-center gap-3 text-gray-200">
        <Loader2 className="size-6 animate-spin text-fuchsia-300" />
        <p>Decrypting your session…</p>
      </div>
    </main>
  )
}
