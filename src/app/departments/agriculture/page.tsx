'use client';

import Link from 'next/link';
import { ArrowLeft, Plus } from 'lucide-react';
import { useState } from 'react';

export default function AgricultureDepartmentPage() {
  const [formData, setFormData] = useState({
    activityName: '',
    location: '',
    status: 'Planning',
    startDate: '',
    villagers: '',
    volunteers: '',
    beneficiaries: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Activity submitted:', formData);
    alert('Activity added successfully!');
    setFormData({
      activityName: '',
      location: '',
      status: 'Planning',
      startDate: '',
      villagers: '',
      volunteers: '',
      beneficiaries: '',
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        href="/dashboard"
        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-6"
      >
        <ArrowLeft size={20} />
        <span>Back to Dashboard</span>
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <Plus size={32} className="text-green-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Add Agricultural Activity</h1>
          <p className="text-gray-600 mt-1">Create a new agricultural activity record</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Activity Name</label>
            <input
              type="text"
              name="activityName"
              value={formData.activityName}
              onChange={handleInputChange}
              placeholder="e.g., Soil Preparation for Maize"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="e.g., Ntcheu District - Green Valley Farm"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              >
                <option value="Planning">Planning</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Number of Villagers Participating</label>
            <input
              type="number"
              name="villagers"
              value={formData.villagers}
              onChange={handleInputChange}
              placeholder="e.g., 12"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Volunteers/Staff Leading (comma-separated)</label>
            <textarea
              name="volunteers"
              value={formData.volunteers}
              onChange={handleInputChange}
              placeholder="e.g., Mary Phiri, Joseph Banda"
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Beneficiary Groups (comma-separated)</label>
            <textarea
              name="beneficiaries"
              value={formData.beneficiaries}
              onChange={handleInputChange}
              placeholder="e.g., Farm Cooperative Group 1, Community Farmers Association"
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Add Activity
            </button>
            <button
              type="button"
              onClick={() =>
                setFormData({
                  activityName: '',
                  location: '',
                  status: 'Planning',
                  startDate: '',
                  villagers: '',
                  volunteers: '',
                  beneficiaries: '',
                })
              }
              className="flex-1 bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
