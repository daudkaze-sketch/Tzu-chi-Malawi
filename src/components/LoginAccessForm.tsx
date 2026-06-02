'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, CheckCircle2, KeyRound, Loader2, Mail, Send, UserCheck } from 'lucide-react';

type FormStatus = 'idle' | 'loading' | 'success' | 'error';
type LoginView = 'admin' | 'request' | 'code' | 'approved';
const ADMIN_EMAIL = 'daud.kaze@gmail.com';

export function LoginAccessForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [view, setView] = useState<LoginView>('admin');
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [status, setStatus] = useState<FormStatus>('idle');
  const [message, setMessage] = useState('');

  const showView = (nextView: LoginView) => {
    setView(nextView);
    setStatus('idle');
    setMessage('');
  };

  const loginSuccess = () => {
    setStatus('success');
    router.push(searchParams.get('from') || '/dashboard');
    router.refresh();
  };

  const requestAccess = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('loading');
    setMessage('');

    const response = await fetch('/api/auth/request-access', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, name }),
    });
    const data = await response.json();

    if (!response.ok) {
      setStatus('error');
      setMessage(data.message ?? 'Could not send request.');
      return;
    }

    setStatus('success');
    setMessage(data.message ?? 'Request sent. Wait for administrator approval.');
    setView('code');
  };

  const verifyCode = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('loading');
    setMessage('');

    const response = await fetch('/api/auth/verify-code', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, code }),
    });
    const data = await response.json();

    if (!response.ok) {
      setStatus('error');
      setMessage(data.message ?? 'Could not verify code.');
      return;
    }

    loginSuccess();
  };

  const enterApproved = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('loading');
    setMessage('');

    const response = await fetch('/api/auth/approved-login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, adminCode: view === 'admin' ? adminCode : undefined }),
    });
    const data = await response.json();

    if (!response.ok) {
      setStatus('error');
      setMessage(data.message ?? 'Could not enter with this email.');
      return;
    }

    loginSuccess();
  };

  return (
    <div className="w-full">
      {message && (
        <div
          className={`mb-5 rounded-lg border px-4 py-3 text-sm font-semibold shadow-sm ${
            status === 'error' ? 'border-red-200 bg-red-50 text-red-700' : 'border-green-200 bg-green-50 text-green-700'
          }`}
        >
          {message}
        </div>
      )}

      {view === 'admin' && (
        <AuthCard
          icon={<UserCheck size={22} />}
          title="Administrator access"
          description="Use the administrator email to enter without an access code."
          tone="indigo"
        >
          <form onSubmit={enterApproved} className="space-y-4">
            <Field label="Administrator email" htmlFor="admin-email">
              <input
                id="admin-email"
                className={inputClass('indigo')}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="daud.kaze@gmail.com"
                type="email"
                required
              />
            </Field>

            <Field label="Administrator code" htmlFor="admin-code">
              <input
                id="admin-code"
                className={inputClass('indigo')}
                value={adminCode}
                onChange={(event) => setAdminCode(event.target.value)}
                placeholder="Administrator code"
                type="password"
                required
              />
            </Field>

            <button className={buttonClass('indigo')} disabled={status === 'loading'} type="submit">
              {status === 'loading' ? <Loader2 className="animate-spin" size={18} /> : <UserCheck size={18} />}
              Enter
            </button>
          </form>
          <div className="mt-6 border-t border-slate-200 pt-5">
            <button type="button" className={secondaryButtonClass('sky')} onClick={() => showView('request')}>
              <Send size={16} />
              General access
            </button>
          </div>
        </AuthCard>
      )}

      {view === 'request' && (
        <AuthCard
          icon={<Mail size={22} />}
          title="Request approval"
          description="Enter your full name and email so the administrator can review your access."
          onBack={() => showView('admin')}
        >
          <form onSubmit={requestAccess} className="space-y-4">
            <Field label="Full name" htmlFor="name">
              <input
                id="name"
                className={inputClass('sky')}
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Full name"
                required
              />
            </Field>

            <Field label="Email" htmlFor="request-email">
              <input
                id="request-email"
                className={inputClass('sky')}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@example.org"
                type="email"
                required
              />
            </Field>

            <button className={buttonClass('sky')} disabled={status === 'loading'} type="submit">
              {status === 'loading' ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
              Request approval
            </button>
          </form>
          <CardFooter onAlreadyApproved={() => showView('approved')} onCode={() => showView('code')} />
        </AuthCard>
      )}

      {view === 'code' && (
        <AuthCard
          icon={<KeyRound size={22} />}
          title="Enter access code"
          description="Use the code shared by the administrator after approval."
          tone="emerald"
          onBack={() => showView('request')}
        >
          <form onSubmit={verifyCode} className="space-y-4">
            <Field label="Approved email" htmlFor="login-email">
              <input
                id="login-email"
                className={inputClass('emerald')}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@example.org"
                type="email"
                required
              />
            </Field>

            <Field label="Code" htmlFor="code">
              <input
                id="code"
                className={`${inputClass('emerald')} text-center font-mono text-xl font-bold tracking-[0.35em] placeholder:text-slate-300`}
                value={code}
                onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
                inputMode="numeric"
                minLength={6}
                maxLength={6}
                placeholder="123456"
                required
              />
            </Field>

            <button className={buttonClass('emerald')} disabled={status === 'loading'} type="submit">
              {status === 'loading' ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
              Log in
            </button>
          </form>
          <CardFooter onAlreadyApproved={() => showView('approved')} onRequest={() => showView('request')} />
        </AuthCard>
      )}

      {view === 'approved' && (
        <AuthCard
          icon={<UserCheck size={22} />}
          title="Already approved"
          description="Enter your approved email to access the system."
          tone="indigo"
          onBack={() => showView('request')}
        >
          <form onSubmit={enterApproved} className="space-y-4">
            <Field label="Approved email" htmlFor="approved-email">
              <input
                id="approved-email"
                className={inputClass('indigo')}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@example.org"
                type="email"
                required
              />
            </Field>

            <button className={buttonClass('indigo')} disabled={status === 'loading'} type="submit">
              {status === 'loading' ? <Loader2 className="animate-spin" size={18} /> : <UserCheck size={18} />}
              Enter
            </button>
          </form>
          <div className="mt-6 border-t border-slate-200 pt-5">
            <button
              type="button"
              className={secondaryButtonClass('sky')}
              onClick={() => showView('request')}
            >
              <Send size={16} />
              Request approval instead
            </button>
          </div>
        </AuthCard>
      )}
    </div>
  );
}

function AuthCard({
  icon,
  title,
  description,
  children,
  tone = 'sky',
  onBack,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
  tone?: 'sky' | 'emerald' | 'indigo';
  onBack?: () => void;
}) {
  const toneClass = {
    sky: 'bg-sky-50 text-sky-700 ring-sky-100',
    emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    indigo: 'bg-indigo-50 text-indigo-700 ring-indigo-100',
  }[tone];

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      {onBack && (
        <button
          type="button"
          className="mb-5 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950"
          onClick={onBack}
        >
          <ArrowLeft size={16} />
          Back
        </button>
      )}
      <div className="mb-6 flex items-start gap-3">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ring-1 ${toneClass}`}>{icon}</div>
        <div>
          <h3 className="text-xl font-bold text-slate-950">{title}</h3>
          <p className="mt-1 text-sm leading-5 text-slate-500">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
    </div>
  );
}

function CardFooter({
  onAlreadyApproved,
  onCode,
  onRequest,
}: {
  onAlreadyApproved: () => void;
  onCode?: () => void;
  onRequest?: () => void;
}) {
  return (
    <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
      <button type="button" className={secondaryButtonClass('indigo')} onClick={onAlreadyApproved}>
        <UserCheck size={16} />
        Already approved
      </button>
      {onCode && (
        <button type="button" className={secondaryButtonClass('emerald')} onClick={onCode}>
          <KeyRound size={16} />
          I have an access code
        </button>
      )}
      {onRequest && (
        <button type="button" className={secondaryButtonClass('sky')} onClick={onRequest}>
          <Send size={16} />
          Request approval
        </button>
      )}
    </div>
  );
}

function inputClass(tone: 'sky' | 'emerald' | 'indigo') {
  const focus = {
    sky: 'focus:border-sky-600 focus:ring-sky-600',
    emerald: 'focus:border-emerald-600 focus:ring-emerald-600',
    indigo: 'focus:border-indigo-600 focus:ring-indigo-600',
  }[tone];

  return `w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-950 outline-none transition placeholder:text-slate-400 focus:ring-2 ${focus}`;
}

function buttonClass(tone: 'sky' | 'emerald' | 'indigo') {
  const color = {
    sky: 'bg-sky-700 hover:bg-sky-800',
    emerald: 'bg-emerald-700 hover:bg-emerald-800',
    indigo: 'bg-indigo-700 hover:bg-indigo-800',
  }[tone];

  return `flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-bold text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-70 ${color}`;
}

function secondaryButtonClass(tone: 'sky' | 'emerald' | 'indigo') {
  const color = {
    sky: 'border-sky-200 bg-sky-50 text-sky-700 hover:border-sky-300 hover:bg-sky-100',
    emerald: 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-300 hover:bg-emerald-100',
    indigo: 'border-indigo-200 bg-indigo-50 text-indigo-700 hover:border-indigo-300 hover:bg-indigo-100',
  }[tone];

  return `inline-flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-bold transition sm:w-auto ${color}`;
}
