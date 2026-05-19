'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Users, Plus, Clock, Trash2 } from 'lucide-react';

interface Attendance {
  id: string;
  name: string;
  department: string;
  checkInTime: string;
  checkOutTime?: string;
  status: string;
  remarks?: string;
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
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Attendance</h1>
        <Link
          href="/attendance/new"
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition"
        >
          <Plus size={20} />
          <span>Mark Attendance</span>
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {attendances.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <Users size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 mb-4">No attendance records yet</p>
          <Link
            href="/attendance/new"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg"
          >
            Record Attendance
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-300">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Department</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Check-In</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Check-Out</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Remarks</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {attendances.map((record) => (
                <tr key={record.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-800">{record.name}</td>
                  <td className="px-6 py-4 text-gray-600">{record.department}</td>
                  <td className="px-6 py-4 text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Clock size={16} />
                      <span>{new Date(record.checkInTime).toLocaleTimeString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {record.checkOutTime
                      ? new Date(record.checkOutTime).toLocaleTimeString()
                      : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(record.status)}`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">{record.remarks || '-'}</td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    <button
                      type="button"
                      onClick={() => handleDeleteAttendance(record.id)}
                      className="text-red-600 hover:text-red-800"
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
      )}
    </div>
  );
}
