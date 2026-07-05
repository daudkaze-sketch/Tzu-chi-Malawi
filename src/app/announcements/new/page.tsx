'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Send } from 'lucide-react';

export default function NewAnnouncementPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [type, setType] = useState('General Announcement');
  const [messageContent, setMessageContent] = useState('');
  const [eventType, setEventType] = useState('');
  const [newsCategory, setNewsCategory] = useState('General');
  const [priorityLevel, setPriorityLevel] = useState('Medium');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [files, setFiles] = useState<FileList | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const today = useMemo(() => new Date().toISOString().split('T')[0], []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('type', type);
    formData.append('messageContent', messageContent);
    formData.append('eventType', eventType);
    formData.append('newsCategory', newsCategory);
    formData.append('priorityLevel', priorityLevel);
    formData.append('date', date || today);

    if (files) {
      Array.from(files).forEach((file) => formData.append('attachments', file));
    }

    try {
      const response = await fetch('/api/announcements', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to create announcement');
      }

      router.push('/announcements');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create announcement');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Link href="/announcements" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700">
        <ArrowLeft size={18} />
        Back to announcements
      </Link>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">News</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Post a new update</h1>
            <p className="mt-2 text-sm text-slate-600">Add the main announcement details, related event type, and the category that fits your website content.</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Plus size={22} />
          </div>
        </div>

        {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Title</label>
              <input value={title} onChange={(event) => setTitle(event.target.value)} required className="w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="For example: New volunteer schedule published" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Announcement type</label>
              <select value={type} onChange={(event) => setType(event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2">
                <option>General Announcement</option>
                <option>Weekly Schedule</option>
                <option>Emergency Message</option>
                <option>Event Notice</option>
              </select>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Event type</label>
              <input value={eventType} onChange={(event) => setEventType(event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="Example: Community outreach, training, distribution" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">News category</label>
              <select value={newsCategory} onChange={(event) => setNewsCategory(event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2">
                <option>General</option>
                <option>Education</option>
                <option>Charity</option>
                <option>Community</option>
                <option>Emergency</option>
              </select>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Priority</label>
              <select value={priorityLevel} onChange={(event) => setPriorityLevel(event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2">
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Date</label>
              <input type="date" value={date} onChange={(event) => setDate(event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Details</label>
            <textarea value={messageContent} onChange={(event) => setMessageContent(event.target.value)} required rows={6} className="w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="Write the full news details, including what happened, who it affected, and what people should know." />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Attachments</label>
            <input type="file" multiple onChange={(event) => setFiles(event.target.files)} className="block w-full rounded-lg border border-dashed border-slate-300 px-3 py-3 text-sm text-slate-600" />
          </div>

          <div className="flex items-center justify-end gap-3">
            <Link href="/announcements" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel</Link>
            <button type="submit" disabled={submitting} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70">
              <Send size={16} />
              {submitting ? 'Posting...' : 'Post news'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
