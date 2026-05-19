'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, School } from 'lucide-react';

interface PreSchoolMonitoring {
  id: string;
  schoolName: string;
  location: string;
  numberOfChildren: number;
  numberOfTeachers: number;
  attendanceRate: string;
  cleanlinessLevel: string;
  teachingQuality: string;
  learningMaterialsAvailability: string;
  nutritionStatus: string;
  challenges?: string;
  supportNeeded?: string;
  createdAt: string;
}

export default function PreSchoolMonitoringPage() {
  const [monitorings, setMonitorings] = useState<PreSchoolMonitoring[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchMonitorings();
  }, []);

  const fetchMonitorings = async () => {
    try {
      
      const response = await fetch('/api/pre-school-monitoring', {
        
      });
      const data = await response.json();
      setMonitorings(data.monitorings || []);
    } catch (error) {
      console.error('Failed to fetch monitorings:', error);
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
        <h1 className="text-3xl font-bold text-gray-800">Pre-School Monitoring</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Monitoring</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {monitorings.map((monitoring) => (
          <div key={monitoring.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start space-x-3">
              <School className="text-blue-600 mt-1" size={20} />
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-800">{monitoring.schoolName}</h3>
                <p className="text-gray-600 text-sm">{monitoring.location}</p>
                <p className="text-gray-600 text-sm">Children: {monitoring.numberOfChildren}</p>
                <p className="text-gray-600 text-sm">Teachers: {monitoring.numberOfTeachers}</p>
                <p className="text-gray-600 text-sm">Attendance: {monitoring.attendanceRate}</p>
                <p className="text-gray-600 text-sm">Cleanliness: {monitoring.cleanlinessLevel}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <PreSchoolMonitoringForm
          onClose={() => setShowForm(false)}
          onSubmit={fetchMonitorings}
        />
      )}
    </div>
  );
}

function PreSchoolMonitoringForm({ onClose, onSubmit }: { onClose: () => void; onSubmit: () => void }) {
  const [formData, setFormData] = useState({
    schoolName: '',
    location: '',
    numberOfChildren: '',
    numberOfTeachers: '',
    attendanceRate: '',
    cleanlinessLevel: '',
    teachingQuality: '',
    learningMaterialsAvailability: '',
    nutritionStatus: '',
    challenges: '',
    supportNeeded: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      
      const response = await fetch('/api/pre-school-monitoring', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          numberOfChildren: parseInt(formData.numberOfChildren),
          numberOfTeachers: parseInt(formData.numberOfTeachers),
        }),
      });

      if (response.ok) {
        onSubmit();
        onClose();
      }
    } catch (error) {
      console.error('Failed to create monitoring:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Add Pre-School Monitoring</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="School Name"
              value={formData.schoolName}
              onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
              className="border rounded-lg px-3 py-2"
              required
            />

            <input
              type="text"
              placeholder="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="border rounded-lg px-3 py-2"
              required
            />

            <input
              type="number"
              placeholder="Number of Children"
              value={formData.numberOfChildren}
              onChange={(e) => setFormData({ ...formData, numberOfChildren: e.target.value })}
              className="border rounded-lg px-3 py-2"
              required
            />

            <input
              type="number"
              placeholder="Number of Teachers"
              value={formData.numberOfTeachers}
              onChange={(e) => setFormData({ ...formData, numberOfTeachers: e.target.value })}
              className="border rounded-lg px-3 py-2"
              required
            />

            <input
              type="text"
              placeholder="Attendance Rate (%)"
              value={formData.attendanceRate}
              onChange={(e) => setFormData({ ...formData, attendanceRate: e.target.value })}
              className="border rounded-lg px-3 py-2"
              required
            />

            <select
              value={formData.cleanlinessLevel}
              onChange={(e) => setFormData({ ...formData, cleanlinessLevel: e.target.value })}
              className="border rounded-lg px-3 py-2"
              required
            >
              <option value="">Cleanliness Level</option>
              <option value="Good">Good</option>
              <option value="Average">Average</option>
              <option value="Poor">Poor</option>
            </select>

            <input
              type="text"
              placeholder="Teaching Quality"
              value={formData.teachingQuality}
              onChange={(e) => setFormData({ ...formData, teachingQuality: e.target.value })}
              className="border rounded-lg px-3 py-2"
              required
            />

            <input
              type="text"
              placeholder="Learning Materials Availability"
              value={formData.learningMaterialsAvailability}
              onChange={(e) => setFormData({ ...formData, learningMaterialsAvailability: e.target.value })}
              className="border rounded-lg px-3 py-2"
              required
            />

            <input
              type="text"
              placeholder="Nutrition Status"
              value={formData.nutritionStatus}
              onChange={(e) => setFormData({ ...formData, nutritionStatus: e.target.value })}
              className="border rounded-lg px-3 py-2"
              required
            />
          </div>

          <textarea
            placeholder="Challenges"
            value={formData.challenges}
            onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
            className="border rounded-lg px-3 py-2 w-full"
            rows={2}
          />

          <textarea
            placeholder="Support Needed"
            value={formData.supportNeeded}
            onChange={(e) => setFormData({ ...formData, supportNeeded: e.target.value })}
            className="border rounded-lg px-3 py-2 w-full"
            rows={2}
          />

          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Save Monitoring
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