'use client';

import Link from 'next/link';
import { ArrowLeft, Camera, FileText, FolderOpen, Upload, Video } from 'lucide-react';

export default function UploadCenterPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Link
        href="/departments/media"
        className="mb-6 flex items-center gap-2 text-sm font-bold text-blue-700 transition hover:text-blue-800"
      >
        <ArrowLeft size={20} />
        <span>Back to Media Department</span>
      </Link>

      <div className="mb-8 rounded-xl border border-blue-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100">
            <Upload size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-700">Media Department</p>
            <h1 className="mt-1 text-3xl font-bold text-gray-950">Upload Center</h1>
          </div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <UploadOption
          title="Work Reports Media"
          description="Upload photos and videos connected to work reports."
          href="/departments/media/work-reports"
          icon={Camera}
          color="bg-blue-50 text-blue-700 ring-blue-100"
        />
        <UploadOption
          title="Media Library"
          description="Upload general event photos, videos, and media files."
          href="/departments/media/library"
          icon={Video}
          color="bg-green-50 text-green-700 ring-green-100"
        />
        <UploadOption
          title="Document Center"
          description="Upload PDFs, Word files, presentations, spreadsheets, and text documents."
          href="/departments/media/documents"
          icon={FileText}
          color="bg-purple-50 text-purple-700 ring-purple-100"
        />
      </div>

      <div className="mt-8 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-700 ring-1 ring-slate-100">
            <FolderOpen size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-950">After upload</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Uploaded files appear in Downloads and File Manager, organized by date for browsing and retrieval.
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/departments/media/downloads"
                className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                Open Downloads
              </Link>
              <Link
                href="/departments/media/files"
                className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                Open File Manager
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function UploadOption({
  title,
  description,
  href,
  icon: Icon,
  color,
}: {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
    >
      <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-lg ring-1 ${color}`}>
        <Icon size={22} />
      </div>
      <h2 className="text-lg font-bold text-slate-950">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </Link>
  );
}
