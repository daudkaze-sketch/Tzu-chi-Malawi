'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, ChevronRight, FileText, Plus, Sparkles } from 'lucide-react';

const steps = [
  { id: 1, title: 'Activity basics', description: 'Choose the activity type and date.' },
  { id: 2, title: 'People reached', description: 'Add participants and key beneficiaries.' },
  { id: 3, title: 'Impact summary', description: 'Describe the outcome and follow-up actions.' },
];

export default function CharityReportsPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    activityType: '',
    description: '',
    participants: '',
    location: '',
    date: new Date().toISOString().split('T')[0],
    impact: '',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const progressPercent = useMemo(() => (step / steps.length) * 100, [step]);

  const updateField = (field: string, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleNext = () => setStep((current) => Math.min(current + 1, steps.length));
  const handleBack = () => setStep((current) => Math.max(current - 1, 1));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/charity-activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activityType: formData.activityType,
          description: formData.description,
          participants: formData.participants,
          location: formData.location,
          date: formData.date,
          impact: formData.impact,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save activity report');
      }

      setMessage('Activity report saved successfully.');
      setFormData({
        activityType: '',
        description: '',
        participants: '',
        location: '',
        date: new Date().toISOString().split('T')[0],
        impact: '',
      });
      setStep(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save activity report');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Link href="/departments/charity" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700">
        <ArrowLeft size={18} />
        Back to Charity Department
      </Link>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">Charity</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Activity report</h1>
            <p className="mt-2 text-sm text-slate-600">Add your charity activity step by step so the report stays clear and complete.</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <FileText size={22} />
          </div>
        </div>

        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between text-sm text-slate-500">
            <span>Step {step} of {steps.length}</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <div className="h-2 rounded-full bg-slate-100">
            <div className="h-2 rounded-full bg-emerald-600 transition-all" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        <div className="mb-6 grid gap-3 md:grid-cols-3">
          {steps.map((item) => (
            <div key={item.id} className={`rounded-xl border p-3 ${step >= item.id ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-white'}`}>
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                <span className={`flex h-7 w-7 items-center justify-center rounded-full ${step >= item.id ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}>{item.id}</span>
                {item.title}
              </div>
              <p className="mt-2 text-sm text-slate-600">{item.description}</p>
            </div>
          ))}
        </div>

        {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
        {message && <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && (
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Activity type</label>
                <select value={formData.activityType} onChange={(event) => updateField('activityType', event.target.value)} required className="w-full rounded-lg border border-slate-300 px-3 py-2">
                  <option value="">Select type</option>
                  <option value="Community cleaning">Community cleaning</option>
                  <option value="Health support">Health support</option>
                  <option value="Emergency response">Emergency response</option>
                  <option value="Education outreach">Education outreach</option>
                  <option value="Distribution support">Distribution support</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Date</label>
                <input type="date" value={formData.date} onChange={(event) => updateField('date', event.target.value)} required className="w-full rounded-lg border border-slate-300 px-3 py-2" />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">Description</label>
                <textarea value={formData.description} onChange={(event) => updateField('description', event.target.value)} required rows={4} className="w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="Describe what happened during the activity." />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Participants reached</label>
                <input type="number" min="1" value={formData.participants} onChange={(event) => updateField('participants', event.target.value)} required className="w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="Example: 45" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Location</label>
                <input value={formData.location} onChange={(event) => updateField('location', event.target.value)} required className="w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="Village or district" />
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Impact summary</label>
              <textarea value={formData.impact} onChange={(event) => updateField('impact', event.target.value)} required rows={5} className="w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="Describe the impact, outcome, and follow-up needed." />
            </div>
          )}

          <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-4">
            <button type="button" onClick={handleBack} disabled={step === 1} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50">Back</button>
            <div className="flex items-center gap-3">
              {step < steps.length ? (
                <button type="button" onClick={handleNext} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
                  Continue <ChevronRight size={16} />
                </button>
              ) : (
                <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70">
                  <CheckCircle2 size={16} />
                  {saving ? 'Saving...' : 'Save report'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
