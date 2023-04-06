import { signIn } from 'next-auth/react'
import { NextPage } from 'next'
const Login: NextPage = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={() => void signIn()}
      >
        Sign in
      </button>
    </main>
  )
}

export default Login
