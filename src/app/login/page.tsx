import { Suspense } from 'react';
import { Building2, LockKeyhole, ShieldCheck } from 'lucide-react';

import { LoginAccessForm } from '@/components/LoginAccessForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[minmax(360px,0.92fr)_1.08fr]">
        <section className="relative flex flex-col justify-between overflow-hidden bg-[#082f49] px-6 py-10 text-white sm:px-10 lg:px-14">
          <div className="absolute inset-x-0 top-0 h-px bg-white/20" />
          <div className="absolute -right-32 top-24 h-72 w-72 rounded-full bg-cyan-300/10 blur-3xl" />
          <div className="absolute -bottom-24 left-10 h-64 w-64 rounded-full bg-blue-300/10 blur-3xl" />

          <div className="relative flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/15">
              <Building2 size={22} />
            </div>
            <div>
              <p className="text-sm font-bold tracking-wide text-white">Tzu Chi Malawi</p>
              <p className="text-xs font-medium text-sky-100">Office Operations Portal</p>
            </div>
          </div>

          <div className="relative my-16 max-w-lg lg:my-0">
            <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/15">
              <ShieldCheck size={26} />
            </div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-200">Private Access</p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Secure access for approved foundation members.
            </h1>
            <p className="mt-5 max-w-md text-base leading-7 text-sky-50">
              Requests are reviewed before a login code is released through the main administrator email.
            </p>
          </div>

          <div className="relative grid gap-3 text-sm text-sky-50 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {['Request reviewed', 'Code controlled', 'Private session'].map((item) => (
              <div key={item} className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.06] px-3 py-2">
                <LockKeyhole size={15} className="text-sky-200" />
                <span className="font-semibold">{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="flex items-center justify-center px-4 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-3xl">
            <div className="mb-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">Sign in</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Access the office system</h2>
            </div>
            <Suspense fallback={<div className="text-sm font-medium text-gray-500">Loading access form...</div>}>
              <LoginAccessForm />
            </Suspense>
          </div>
        </section>
      </div>
    </div>
  );
}
