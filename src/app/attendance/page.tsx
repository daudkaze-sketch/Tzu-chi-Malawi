'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Users, Plus, Clock, Trash2 } from 'lucide-react';
import { ExportOptions, type ExportColumn } from '@/components/ExportOptions';

interface Attendance {
  id: string;
  name: string;
  department: string;
  checkInTime: string;
  checkOutTime?: string;
  status: string;
  remarks?: string;
}

const attendanceColumns: ExportColumn<Attendance>[] = [
  { header: 'Name', accessor: 'name' },
  { header: 'Department', accessor: 'department' },
  { header: 'Check-In', accessor: (record) => formatTime(record.checkInTime) },
  { header: 'Check-Out', accessor: (record) => record.checkOutTime ? formatTime(record.checkOutTime) : '-' },
  { header: 'Status', accessor: 'status' },
  { header: 'Remarks', accessor: (record) => record.remarks || '-' },
];

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString();
}

export default function AttendancePage() {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchAttendances();
  }, [router]);

  const fetchAttendances = async () => {
    try {
      const res = await fetch('/api/attendance');
      const data = await res.json();
      setAttendances(data.attendances || []);
    } catch (err) {
      setError('Failed to fetch attendance records');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAttendance = async (id: string) => {
    if (!confirm('Are you sure you want to delete this attendance record?')) return;

    try {
      
      

      const response = await fetch(`/api/attendance/${id}`, {
        method: 'DELETE',
        
      });

      if (response.ok) {
        fetchAttendances();
      } else {
        alert('Failed to delete attendance record');
      }
    } catch (error) {
      console.error('Delete attendance error:', error);
      alert('Failed to delete attendance record');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Present': 'bg-green-100 text-green-800',
      'Absent': 'bg-red-100 text-red-800',
      'Late': 'bg-yellow-100 text-yellow-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-sm font-medium text-gray-500">Loading attendance...</div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
            People
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-950">Attendance</h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-600">
            Monitor staff presence, check-in activity, and attendance exceptions.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {attendances.length > 0 && (
            <ExportOptions
              columns={attendanceColumns}
              data={attendances}
              fileName="attendance-records"
              title="Attendance Records"
            />
          )}
          <Link
            href="/attendance/new"
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-blue-700 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800"
          >
            <Plus size={18} />
            <span>Mark Attendance</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {attendances.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center shadow-sm">
          <Users size={44} className="mx-auto mb-4 text-gray-400" />
          <p className="text-base font-semibold text-gray-800">No attendance records yet</p>
          <p className="mt-1 text-sm text-gray-500">
            Start by recording today&apos;s attendance.
          </p>
          <Link
            href="/attendance/new"
            className="mt-6 inline-flex h-10 items-center rounded-lg bg-blue-700 px-5 text-sm font-semibold text-white transition hover:bg-blue-800"
          >
            Record Attendance
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
          <table className="w-full min-w-[920px]">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">Name</th>
                <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">Department</th>
                <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">Check-In</th>
                <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">Check-Out</th>
                <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">Status</th>
                <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">Remarks</th>
                <th className="px-5 py-3 text-right text-xs font-bold uppercase tracking-wide text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {attendances.map((record) => (
                <tr key={record.id} className="transition hover:bg-blue-50/40">
                  <td className="px-5 py-4 text-sm font-medium text-gray-900">{record.name}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{record.department}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <Clock size={16} />
                      <span>{formatTime(record.checkInTime)}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">
                    {record.checkOutTime
                      ? formatTime(record.checkOutTime)
                      : '-'}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusColor(record.status)}`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">{record.remarks || '-'}</td>
                  <td className="px-5 py-4 text-right text-sm text-gray-600">
                    <button
                      type="button"
                      onClick={() => handleDeleteAttendance(record.id)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-100 text-red-700 transition hover:bg-red-50"
                      title="Delete attendance"
                    >
                      <Trash2 size={18} />
                    </button>
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
