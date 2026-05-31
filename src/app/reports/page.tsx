'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Edit2, FileText, Plus, Trash2 } from 'lucide-react';
import { ExportOptions, type ExportColumn } from '@/components/ExportOptions';

interface DailyReport {
  id: string;
  date: string;
  department: string;
  workDone: string;
  involved: string;
  location: string;
  status: string;
  challenges?: string;
  solutions?: string;
  images?: string;
}

const reportColumns: ExportColumn<DailyReport>[] = [
  { header: 'Date', accessor: (report) => formatDate(report.date) },
  { header: 'Department', accessor: 'department' },
  { header: 'Work Done', accessor: 'workDone' },
  { header: 'Involved', accessor: 'involved' },
  { header: 'Location', accessor: 'location' },
  { header: 'Status', accessor: 'status' },
  { header: 'Challenges', accessor: (report) => report.challenges || '-' },
  { header: 'Solutions', accessor: (report) => report.solutions || '-' },
];

function formatDate(value: string) {
  return new Date(value).toLocaleDateString();
}

export default function ReportsListPage() {
  const [reports, setReports] = useState<DailyReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchReports();
  }, [router]);

  const fetchReports = async () => {
    try {
      const res = await fetch('/api/reports');
      const data = await res.json();
      setReports(data.reports || []);
    } catch (err) {
      setError('Failed to fetch reports');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'not-started': 'bg-gray-100 text-gray-700 ring-gray-200',
      'in-progress': 'bg-blue-50 text-blue-700 ring-blue-200',
      completed: 'bg-green-50 text-green-700 ring-green-200',
    };
    return colors[status] || colors['in-progress'];
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm font-medium text-gray-500">
        Loading reports...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
            Operations
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-950">
            Daily Reports
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-600">
            Review submitted field activity, department coverage, and daily execution notes.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {reports.length > 0 && (
            <ExportOptions
              columns={reportColumns}
              data={reports}
              fileName="daily-reports"
              title="Daily Reports"
            />
          )}
          <Link
            href="/reports/new"
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-blue-700 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800"
          >
            <Plus size={18} />
            <span>Add Report</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {reports.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center shadow-sm">
          <FileText size={44} className="mx-auto mb-4 text-gray-400" />
          <p className="text-base font-semibold text-gray-800">No reports yet</p>
          <p className="mt-1 text-sm text-gray-500">
            Create the first daily report to begin tracking field activity.
          </p>
          <Link
            href="/reports/new"
            className="mt-6 inline-flex h-10 items-center rounded-lg bg-blue-700 px-5 text-sm font-semibold text-white transition hover:bg-blue-800"
          >
            Create First Report
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[960px]">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">Date</th>
                  <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">Department</th>
                  <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">Work Summary</th>
                  <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">Involved</th>
                  <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">Location</th>
                  <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">Status</th>
                  <th className="px-5 py-3 text-right text-xs font-bold uppercase tracking-wide text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reports.map((report) => (
                  <tr key={report.id} className="transition hover:bg-blue-50/40">
                    <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-gray-900">
                      {formatDate(report.date)}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-700">{report.department}</td>
                    <td className="max-w-md px-5 py-4 text-sm text-gray-600">
                      <span className="line-clamp-2">{report.workDone}</span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">{report.involved}</td>
                    <td className="px-5 py-4 text-sm text-gray-600">{report.location}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-blue-100 text-blue-700 transition hover:bg-blue-50"
                          title="Edit report"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          type="button"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-100 text-red-700 transition hover:bg-red-50"
                          title="Delete report"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
