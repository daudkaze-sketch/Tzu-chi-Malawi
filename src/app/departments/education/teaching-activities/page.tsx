'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, FileText } from 'lucide-react';

interface TeachingActivity {
  id: string;
  type: string;
  location: string;
  participants: number;
  ageGroup?: string;
  topicsCovered: string;
  duration?: string;
  materialsUsed?: string;
  understandingLevel?: string;
  feedback?: string;
  challenges?: string;
  followUpPlan?: string;
  createdAt: string;
}

export default function TeachingActivitiesPage() {
  const [activities, setActivities] = useState<TeachingActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/teaching-activities', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setActivities(data.activities || []);
    } catch (error) {
      console.error('Failed to fetch activities:', error);
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
        <h1 className="text-3xl font-bold text-gray-800">Teaching Activities</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Activity</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.map((activity) => (
          <div key={activity.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start space-x-3">
              <FileText className="text-blue-600 mt-1" size={20} />
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-800">{activity.type}</h3>
                <p className="text-gray-600 text-sm">{activity.location}</p>
                <p className="text-gray-600 text-sm">Participants: {activity.participants}</p>
                {activity.ageGroup && <p className="text-gray-600 text-sm">Age: {activity.ageGroup}</p>}
                <p className="text-gray-600 text-sm mt-2">{activity.topicsCovered}</p>
                {activity.duration && <p className="text-gray-600 text-sm">Duration: {activity.duration}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <TeachingActivityForm
          onClose={() => setShowForm(false)}
          onSubmit={fetchActivities}
        />
      )}
    </div>
  );
}

function TeachingActivityForm({ onClose, onSubmit }: { onClose: () => void; onSubmit: () => void }) {
  const [formData, setFormData] = useState({
    type: '',
    location: '',
    participants: '',
    ageGroup: '',
    topicsCovered: '',
    duration: '',
    materialsUsed: '',
    understandingLevel: '',
    feedback: '',
    challenges: '',
    followUpPlan: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/teaching-activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          participants: parseInt(formData.participants),
        }),
      });

      if (response.ok) {
        onSubmit();
        onClose();
      }
    } catch (error) {
      console.error('Failed to create activity:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Add Teaching Activity</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="border rounded-lg px-3 py-2"
              required
            >
              <option value="">Select Type</option>
              <option value="Dharma">Dharma</option>
              <option value="Jing Si Aphorism">Jing Si Aphorism</option>
              <option value="Training">Training</option>
            </select>

            <select
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="border rounded-lg px-3 py-2"
              required
            >
              <option value="">Select Location</option>
              <option value="Office">Office</option>
              <option value="School">School</option>
              <option value="Home Visit">Home Visit</option>
            </select>

            <input
              type="number"
              placeholder="Number of Participants"
              value={formData.participants}
              onChange={(e) => setFormData({ ...formData, participants: e.target.value })}
              className="border rounded-lg px-3 py-2"
              required
            />

            <input
              type="text"
              placeholder="Age Group"
              value={formData.ageGroup}
              onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value })}
              className="border rounded-lg px-3 py-2"
            />

            <input
              type="text"
              placeholder="Duration"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className="border rounded-lg px-3 py-2"
            />

            <select
              value={formData.understandingLevel}
              onChange={(e) => setFormData({ ...formData, understandingLevel: e.target.value })}
              className="border rounded-lg px-3 py-2"
            >
              <option value="">Understanding Level</option>
              <option value="Good">Good</option>
              <option value="Average">Average</option>
              <option value="Poor">Poor</option>
            </select>
          </div>

          <textarea
            placeholder="Topics Covered"
            value={formData.topicsCovered}
            onChange={(e) => setFormData({ ...formData, topicsCovered: e.target.value })}
            className="border rounded-lg px-3 py-2 w-full"
            rows={3}
            required
          />

          <textarea
            placeholder="Materials Used"
            value={formData.materialsUsed}
            onChange={(e) => setFormData({ ...formData, materialsUsed: e.target.value })}
            className="border rounded-lg px-3 py-2 w-full"
            rows={2}
          />

          <textarea
            placeholder="Feedback"
            value={formData.feedback}
            onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
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
            placeholder="Follow-up Plan"
            value={formData.followUpPlan}
            onChange={(e) => setFormData({ ...formData, followUpPlan: e.target.value })}
            className="border rounded-lg px-3 py-2 w-full"
            rows={2}
          />

          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Save Activity
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