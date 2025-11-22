// THIS IS A TESTING PAGE
import { Shield, Terminal } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from 'renderer/components/ui/alert'
import { Button } from 'renderer/components/ui/button'

export function PrivacyScreen() {
  const navigate = useNavigate()

  return (
    <main className="flex h-screen items-center justify-center bg-black px-6">
      <section className="flex w-full max-w-3xl flex-col gap-8 rounded-2xl border border-white/10 bg-white/5 p-8 text-white shadow-2xl backdrop-blur">
        <div className="flex items-center gap-3 text-fuchsia-200">
          <Shield className="size-8 text-fuchsia-400" />
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-fuchsia-200/80">
              Offline privacy
            </p>
            <h1 className="text-3xl font-semibold text-white">
              Your device, your data
            </h1>
          </div>
        </div>

        <Alert className="border-white/10 bg-black/40 text-gray-200">
          <AlertTitle className="flex items-center gap-2 text-xl text-teal-300">
            <Terminal className="size-5 text-fuchsia-300" />
            Local auth architecture
          </AlertTitle>
          <AlertDescription className="space-y-3 text-base text-gray-300">
            <p>Kelarin never sends credentials to any server.</p>
            <ul className="list-disc space-y-2 pl-6 text-gray-200">
              <li>
                Passwords are hashed with bcrypt (12 rounds) the moment you hit
                register.
              </li>
              <li>
                Hashes are stored inside an encrypted SQLite database under your
                user data directory.
              </li>
              <li>
                A single-session flag keeps you signed in locally without any
                network calls.
              </li>
            </ul>
          </AlertDescription>
        </Alert>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <Button onClick={() => navigate(-1)} variant="outline">
            Go back
          </Button>
          <Button onClick={() => navigate('/')}>Return to dashboard</Button>
        </div>
      </section>
    </main>
  )
}
