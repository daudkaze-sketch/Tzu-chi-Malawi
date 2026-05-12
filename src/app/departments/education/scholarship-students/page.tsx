'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, User } from 'lucide-react';

interface ScholarshipStudent {
  id: string;
  studentName: string;
  school: string;
  grade: string;
  academicPerformance: string;
  attendance: string;
  behavior: string;
  financialSupport: string;
  guardianDetails: string;
  progressReports?: string;
  challenges?: string;
  recommendations?: string;
  createdAt: string;
}

export default function ScholarshipStudentsPage() {
  const [students, setStudents] = useState<ScholarshipStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/scholarship-students', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setStudents(data.students || []);
    } catch (error) {
      console.error('Failed to fetch students:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link
        href="/departments/education"
        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-6"
      >
        <ArrowLeft size={20} />
        <span>Back to Education Department</span>
      </Link>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Scholarship Students</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Student</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.map((student) => (
          <div key={student.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start space-x-3">
              <User className="text-blue-600 mt-1" size={20} />
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-800">{student.studentName}</h3>
                <p className="text-gray-600 text-sm">{student.school}</p>
                <p className="text-gray-600 text-sm">Grade: {student.grade}</p>
                <p className="text-gray-600 text-sm">Performance: {student.academicPerformance}</p>
                <p className="text-gray-600 text-sm">Attendance: {student.attendance}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <ScholarshipStudentForm
          onClose={() => setShowForm(false)}
          onSubmit={fetchStudents}
        />
      )}
    </div>
  );
}

function ScholarshipStudentForm({ onClose, onSubmit }: { onClose: () => void; onSubmit: () => void }) {
  const [formData, setFormData] = useState({
    studentName: '',
    school: '',
    grade: '',
    academicPerformance: '',
    attendance: '',
    behavior: '',
    financialSupport: '',
    guardianDetails: '',
    progressReports: '',
    challenges: '',
    recommendations: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/scholarship-students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onSubmit();
        onClose();
      }
    } catch (error) {
      console.error('Failed to create student:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Add Scholarship Student</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Student Name"
              value={formData.studentName}
              onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
              className="border rounded-lg px-3 py-2"
              required
            />

            <input
              type="text"
              placeholder="School"
              value={formData.school}
              onChange={(e) => setFormData({ ...formData, school: e.target.value })}
              className="border rounded-lg px-3 py-2"
              required
            />

            <input
              type="text"
              placeholder="Grade"
              value={formData.grade}
              onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
              className="border rounded-lg px-3 py-2"
              required
            />

            <input
              type="text"
              placeholder="Academic Performance"
              value={formData.academicPerformance}
              onChange={(e) => setFormData({ ...formData, academicPerformance: e.target.value })}
              className="border rounded-lg px-3 py-2"
              required
            />

            <input
              type="text"
              placeholder="Attendance"
              value={formData.attendance}
              onChange={(e) => setFormData({ ...formData, attendance: e.target.value })}
              className="border rounded-lg px-3 py-2"
              required
            />

            <input
              type="text"
              placeholder="Behavior/Discipline"
              value={formData.behavior}
              onChange={(e) => setFormData({ ...formData, behavior: e.target.value })}
              className="border rounded-lg px-3 py-2"
              required
            />

            <input
              type="text"
              placeholder="Financial Support Provided"
              value={formData.financialSupport}
              onChange={(e) => setFormData({ ...formData, financialSupport: e.target.value })}
              className="border rounded-lg px-3 py-2"
              required
            />
          </div>

          <textarea
            placeholder="Guardian Details"
            value={formData.guardianDetails}
            onChange={(e) => setFormData({ ...formData, guardianDetails: e.target.value })}
            className="border rounded-lg px-3 py-2 w-full"
            rows={2}
            required
          />

          <textarea
            placeholder="Progress Reports"
            value={formData.progressReports}
            onChange={(e) => setFormData({ ...formData, progressReports: e.target.value })}
            className="border rounded-lg px-3 py-2 w-full"
            rows={2}
          />

          <textarea
            placeholder="Challenges"
            value={formData.challenges}
            onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
            className="border rounded-lg px-3 py-2 w-full"
            rows={2}
          />

          <textarea
            placeholder="Recommendations"
            value={formData.recommendations}
            onChange={(e) => setFormData({ ...formData, recommendations: e.target.value })}
            className="border rounded-lg px-3 py-2 w-full"
            rows={2}
          />

          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Save Student
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}