'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Users, MapPin, Calendar, Activity, X } from 'lucide-react';

interface CommunityActivity {
  id: string;
  activityTitle: string;
  activityType: string;
  description: string;
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  participants: number;
  ageGroups: string;
  outcome: string;
  challenges: string;
  lessons: string;
  impact: string;
  targetBeneficiaries: string;
  materials: string;
  volunteerInvolved: number;
  followUpActions: string;
  createdAt: string;
  userId: string;
}

export default function CommunityActivitiesPage() {
  const [activities, setActivities] = useState<CommunityActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    activityTitle: '',
    activityType: '',
    description: '',
    location: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '',
    endTime: '',
    participants: '',
    ageGroups: '',
    outcome: '',
    challenges: '',
    lessons: '',
    impact: '',
    targetBeneficiaries: '',
    materials: '',
    volunteerInvolved: '',
    followUpActions: '',
  });

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      
      

      const response = await fetch('/api/community-activities', {
        
      });
      const data = await response.json();
      setActivities(data.activities || []);
    } catch (error) {
      console.error('Failed to fetch activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      
      

      const response = await fetch('/api/community-activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activityTitle: formData.activityTitle,
          activityType: formData.activityType,
          description: formData.description,
          location: formData.location,
          date: new Date(formData.date),
          startTime: formData.startTime,
          endTime: formData.endTime,
          participants: parseInt(formData.participants),
          ageGroups: formData.ageGroups,
          outcome: formData.outcome,
          challenges: formData.challenges,
          lessons: formData.lessons,
          impact: formData.impact,
          targetBeneficiaries: formData.targetBeneficiaries,
          materials: formData.materials,
          volunteerInvolved: parseInt(formData.volunteerInvolved),
          followUpActions: formData.followUpActions,
        }),
      });

      if (response.ok) {
        setShowForm(false);
        setFormData({
          activityTitle: '',
          activityType: '',
          description: '',
          location: '',
          date: new Date().toISOString().split('T')[0],
          startTime: '',
          endTime: '',
          participants: '',
          ageGroups: '',
          outcome: '',
          challenges: '',
          lessons: '',
          impact: '',
          targetBeneficiaries: '',
          materials: '',
          volunteerInvolved: '',
          followUpActions: '',
        });
        fetchActivities();
      } else {
        alert('Failed to save activity');
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Failed to save activity');
    }
  };

  const getActivityTypeColor = (type: string) => {
    switch (type) {
      case 'cleaning':
        return 'bg-green-100 text-green-800';
      case 'health':
        return 'bg-red-100 text-red-800';
      case 'education':
        return 'bg-blue-100 text-blue-800';
      case 'counseling':
        return 'bg-purple-100 text-purple-800';
      case 'community-engagement':
        return 'bg-yellow-100 text-yellow-800';
      case 'recreation':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <Link
          href="/departments/charity"
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft size={20} />
          <span>Back to Charity Department</span>
        </Link>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>New Activity</span>
        </button>
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-8">Community Activities</h1>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Record Community Activity</h2>
            <button
              onClick={() => setShowForm(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Activity Details Section */}
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Activity Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Activity Title *
                  </label>
                  <input
                    type="text"
                    value={formData.activityTitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, activityTitle: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Community Cleaning Day"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Activity Type *
                  </label>
                  <select
                    value={formData.activityType}
                    onChange={(e) => setFormData(prev => ({ ...prev, activityType: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select type</option>
                    <option value="cleaning">Community Cleaning</option>
                    <option value="health">Health Awareness</option>
                    <option value="education">Educational Workshop</option>
                    <option value="counseling">Counseling/Support</option>
                    <option value="community-engagement">Community Engagement</option>
                    <option value="recreation">Recreation/Sports</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Activity Description */}
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Activity Description</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  What was the activity about? *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe the activity, its objectives, and how it was conducted"
                  required
                />
              </div>
            </div>

            {/* Location and Date/Time */}
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">When and Where</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Village, District, Venue"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Participation Section */}
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Participation</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Number of Participants *
                  </label>
                  <input
                    type="number"
                    value={formData.participants}
                    onChange={(e) => setFormData(prev => ({ ...prev, participants: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Volunteers Involved *
                  </label>
                  <input
                    type="number"
                    value={formData.volunteerInvolved}
                    onChange={(e) => setFormData(prev => ({ ...prev, volunteerInvolved: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    required
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age Groups Involved *
                </label>
                <select
                  value={formData.ageGroups}
                  onChange={(e) => setFormData(prev => ({ ...prev, ageGroups: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select age groups</option>
                  <option value="preschool">Pre-school (0-5)</option>
                  <option value="primary">Primary (6-12)</option>
                  <option value="secondary">Secondary (13-18)</option>
                  <option value="youth">Youth (19-35)</option>
                  <option value="adults">Adults (36-60)</option>
                  <option value="elderly">Elderly (60+)</option>
                  <option value="mixed">Mixed/All ages</option>
                </select>
              </div>
            </div>

            {/* Target Section */}
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Target and Resources</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Beneficiaries *
                </label>
                <textarea
                  value={formData.targetBeneficiaries}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetBeneficiaries: e.target.value }))}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Who were the main beneficiaries? (e.g., school children, vulnerable families, elderly)"
                  required
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Materials/Resources Used
                </label>
                <textarea
                  value={formData.materials}
                  onChange={(e) => setFormData(prev => ({ ...prev, materials: e.target.value }))}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="List materials, supplies, or resources used"
                />
              </div>
            </div>

            {/* Outcome and Impact */}
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Outcome & Impact</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  What was the outcome? *
                </label>
                <textarea
                  value={formData.outcome}
                  onChange={(e) => setFormData(prev => ({ ...prev, outcome: e.target.value }))}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="What was accomplished? What were the results?"
                  required
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Impact on Community *
                </label>
                <textarea
                  value={formData.impact}
                  onChange={(e) => setFormData(prev => ({ ...prev, impact: e.target.value }))}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe the positive impact on the community"
                  required
                />
              </div>
            </div>

            {/* Challenges and Lessons */}
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Challenges & Learning</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Challenges Faced
                </label>
                <textarea
                  value={formData.challenges}
                  onChange={(e) => setFormData(prev => ({ ...prev, challenges: e.target.value }))}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="What challenges or difficulties did you encounter?"
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lessons Learned
                </label>
                <textarea
                  value={formData.lessons}
                  onChange={(e) => setFormData(prev => ({ ...prev, lessons: e.target.value }))}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="What did you learn? How can we improve?"
                />
              </div>
            </div>

            {/* Follow-up */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Follow-up Actions</h3>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Are there any follow-up actions needed?
              </label>
              <textarea
                value={formData.followUpActions}
                onChange={(e) => setFormData(prev => ({ ...prev, followUpActions: e.target.value }))}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe any follow-up visits, activities, or support needed"
              />
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Activity
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Activities List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.map((activity) => (
          <div key={activity.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-800 text-lg">{activity.activityTitle}</h3>
                <p className="text-sm text-gray-500">{activity.location}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActivityTypeColor(activity.activityType)}`}>
                {activity.activityType}
              </span>
            </div>

            <div className="space-y-2 text-sm mb-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{new Date(activity.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{activity.participants} participants ({activity.ageGroups})</span>
              </div>
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{activity.volunteerInvolved} volunteers</span>
              </div>
            </div>

            <p className="text-sm text-gray-600 line-clamp-2 mb-3">{activity.description}</p>

            <div className="border-t pt-3">
              <p className="text-xs text-gray-500">
                <strong>Impact:</strong> {activity.impact}
              </p>
            </div>
          </div>
        ))}
      </div>

      {activities.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No activities recorded yet</h3>
          <p className="text-gray-500">Start by recording your first community activity.</p>
        </div>
      )}
    </div>
  );
}