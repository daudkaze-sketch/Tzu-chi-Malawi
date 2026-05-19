'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FileText, Plus, Edit2, Trash2 } from 'lucide-react';

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
      'not-started': 'bg-gray-100 text-gray-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      'completed': 'bg-green-100 text-green-800',
    };
    return colors[status] || colors['in-progress'];
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Daily Reports</h1>
        <Link
          href="/reports/new"
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition"
        >
          <Plus size={20} />
          <span>Add Report</span>
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {reports.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <FileText size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 mb-4">No reports yet</p>
          <Link
            href="/reports/new"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg"
          >
            Create First Report
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    {report.department} - {new Date(report.date).toLocaleDateString()}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{report.workDone}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(report.status)}`}>
                  {report.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                <div>
                  <span className="font-semibold text-gray-800">Involved:</span> {report.involved}
                </div>
                <div>
                  <span className="font-semibold text-gray-800">Location:</span> {report.location}
                </div>
              </div>

              {report.challenges && (
                <div className="text-sm mb-2">
                  <span className="font-semibold text-gray-800">Challenges:</span> {report.challenges}
                </div>
              )}

              {report.images && (
                <div className="mb-4">
                  <span className="font-semibold text-gray-800 text-sm">Images:</span>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                    {JSON.parse(report.images).map((image: { url: string; caption?: string }, index: number) => (
                      <div key={index} className="relative">
                        <img
                          src={image.url}
                          alt={image.caption || `Report image ${index + 1}`}
                          className="w-full h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition"
                          onClick={() => window.open(image.url, '_blank')}
                        />
                        {image.caption && (
                          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg">
                            {image.caption}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex space-x-2 mt-4">
                <button className="flex items-center space-x-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded transition">
                  <Edit2 size={16} />
                  <span>Edit</span>
                </button>
                <button className="flex items-center space-x-1 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded transition">
                  <Trash2 size={16} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
