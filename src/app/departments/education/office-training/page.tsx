'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, BookOpen } from 'lucide-react';

interface OfficeTraining {
  id: string;
  trainingTitle: string;
  trainerName: string;
  date: string;
  duration: string;
  participants: string;
  objectives: string;
  topicsCovered: string;
  skillsGained?: string;
  evaluation?: string;
  feedback?: string;
  createdAt: string;
}

export default function OfficeTrainingPage() {
  const [trainings, setTrainings] = useState<OfficeTraining[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchTrainings();
  }, []);

  const fetchTrainings = async () => {
    try {
      
      const response = await fetch('/api/office-training', {
        
      });
      const data = await response.json();
      setTrainings(data.trainings || []);
    } catch (error) {
      console.error('Failed to fetch trainings:', error);
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
        <h1 className="text-3xl font-bold text-gray-800">Office Training Programs</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Training</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trainings.map((training) => (
          <div key={training.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start space-x-3">
              <BookOpen className="text-blue-600 mt-1" size={20} />
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-800">{training.trainingTitle}</h3>
                <p className="text-gray-600 text-sm">Trainer: {training.trainerName}</p>
                <p className="text-gray-600 text-sm">Date: {new Date(training.date).toLocaleDateString()}</p>
                <p className="text-gray-600 text-sm">Duration: {training.duration}</p>
                <p className="text-gray-600 text-sm">Participants: {training.participants}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <OfficeTrainingForm
          onClose={() => setShowForm(false)}
          onSubmit={fetchTrainings}
        />
      )}
    </div>
  );
}

function OfficeTrainingForm({ onClose, onSubmit }: { onClose: () => void; onSubmit: () => void }) {
  const [formData, setFormData] = useState({
    trainingTitle: '',
    trainerName: '',
    date: '',
    duration: '',
    participants: '',
    objectives: '',
    topicsCovered: '',
    skillsGained: '',
    evaluation: '',
    feedback: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      
      const response = await fetch('/api/office-training', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onSubmit();
        onClose();
      }
    } catch (error) {
      console.error('Failed to create training:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Add Office Training</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Training Title"
              value={formData.trainingTitle}
              onChange={(e) => setFormData({ ...formData, trainingTitle: e.target.value })}
              className="border rounded-lg px-3 py-2"
              required
            />

            <input
              type="text"
              placeholder="Trainer Name"
              value={formData.trainerName}
              onChange={(e) => setFormData({ ...formData, trainerName: e.target.value })}
              className="border rounded-lg px-3 py-2"
              required
            />

            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="border rounded-lg px-3 py-2"
              required
            />

            <input
              type="text"
              placeholder="Duration"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className="border rounded-lg px-3 py-2"
              required
            />

            <input
              type="text"
              placeholder="Participants"
              value={formData.participants}
              onChange={(e) => setFormData({ ...formData, participants: e.target.value })}
              className="border rounded-lg px-3 py-2"
              required
            />
          </div>

          <textarea
            placeholder="Training Objectives"
            value={formData.objectives}
            onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
            className="border rounded-lg px-3 py-2 w-full"
            rows={2}
            required
          />

          <textarea
            placeholder="Topics Covered"
            value={formData.topicsCovered}
            onChange={(e) => setFormData({ ...formData, topicsCovered: e.target.value })}
            className="border rounded-lg px-3 py-2 w-full"
            rows={2}
            required
          />

          <textarea
            placeholder="Skills Gained"
            value={formData.skillsGained}
            onChange={(e) => setFormData({ ...formData, skillsGained: e.target.value })}
            className="border rounded-lg px-3 py-2 w-full"
            rows={2}
          />

          <textarea
            placeholder="Evaluation (Usefulness)"
            value={formData.evaluation}
            onChange={(e) => setFormData({ ...formData, evaluation: e.target.value })}
            className="border rounded-lg px-3 py-2 w-full"
            rows={2}
          />

          <textarea
            placeholder="Feedback from Participants"
            value={formData.feedback}
            onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
            className="border rounded-lg px-3 py-2 w-full"
            rows={2}
          />

          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Save Training
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