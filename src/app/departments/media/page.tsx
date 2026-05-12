'use client';

import Link from 'next/link';
import { ArrowLeft, Camera, Video, FileText, Download, Upload, FolderOpen } from 'lucide-react';

export default function MediaDepartmentPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link
        href="/dashboard"
        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-6"
      >
        <ArrowLeft size={20} />
        <span>Back to Dashboard</span>
      </Link>

      <h1 className="text-3xl font-bold text-gray-800 mb-8">Media Department</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DepartmentModule
          title="Work Reports Media"
          description="Upload and manage pictures and videos for work reports"
          icon={Camera}
          href="/departments/media/work-reports"
          color="bg-blue-100 text-blue-600"
        />
        <DepartmentModule
          title="Media Library"
          description="Upload photos, videos, and documents for events and activities"
          icon={Video}
          href="/departments/media/library"
          color="bg-green-100 text-green-600"
        />
        <DepartmentModule
          title="Document Center"
          description="Upload and organize PPT, PDFs, and other documents"
          icon={FileText}
          href="/departments/media/documents"
          color="bg-purple-100 text-purple-600"
        />
        <DepartmentModule
          title="Downloads"
          description="Browse and download media files and documents"
          icon={Download}
          href="/departments/media/downloads"
          color="bg-orange-100 text-orange-600"
        />
        <DepartmentModule
          title="File Manager"
          description="Organized file browser with date-based sorting"
          icon={FolderOpen}
          href="/departments/media/files"
          color="bg-teal-100 text-teal-600"
        />
        <DepartmentModule
          title="Upload Center"
          description="Central upload hub for all media types"
          icon={Upload}
          href="/departments/media/upload"
          color="bg-indigo-100 text-indigo-600"
        />
      </div>
    </div>
  );
}

function DepartmentModule({
  title,
  description,
  icon: Icon,
  href,
  color,
}: {
  title: string;
  description: string;
  icon: any;
  href: string;
  color: string;
}) {
  return (
    <Link
      href={href}
      className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border border-gray-200"
    >
      <div className="flex items-start space-x-4">
        <div className={`${color} p-3 rounded-lg`}>
          <Icon size={24} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
      </div>
    </Link>
  );
}