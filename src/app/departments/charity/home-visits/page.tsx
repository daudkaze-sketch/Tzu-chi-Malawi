'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Home, Users, Heart, AlertTriangle, CheckCircle, X } from 'lucide-react';

interface HomeVisit {
  id: string;
  beneficiaryName: string;
  familySize: number;
  livingConditions: string;
  mainChallenges: string;
  healthCondition: string;
  incomeSource: string;
  immediateNeeds: string;
  longTermNeeds: string;
  recommendations: string;
  followUpDate?: string;
  status: string;
  createdAt: string;
  userId: string;
}

export default function HomeVisitsPage() {
  const [visits, setVisits] = useState<HomeVisit[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    beneficiaryName: '',
    familySize: '',
    livingConditions: '',
    mainChallenges: '',
    healthCondition: '',
    incomeSource: '',
    immediateNeeds: '',
    longTermNeeds: '',
    recommendations: '',
    followUpDate: '',
  });

  useEffect(() => {
    fetchVisits();
  }, []);

  const fetchVisits = async () => {
    try {
      
      

      const response = await fetch('/api/home-visits', {
        
      });
      const data = await response.json();
      setVisits(data.visits || []);
    } catch (error) {
      console.error('Failed to fetch visits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      
      

      const response = await fetch('/api/home-visits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          beneficiaryName: formData.beneficiaryName,
          familySize: parseInt(formData.familySize) || null,
          livingConditions: formData.livingConditions,
          mainChallenges: formData.mainChallenges,
          healthCondition: formData.healthCondition,
          incomeSource: formData.incomeSource,
          immediateNeeds: formData.immediateNeeds,
          longTermNeeds: formData.longTermNeeds,
          recommendations: formData.recommendations,
          followUpDate: formData.followUpDate || null,
        }),
      });

      if (response.ok) {
        setShowForm(false);
        setFormData({
          beneficiaryName: '',
          familySize: '',
          livingConditions: '',
          mainChallenges: '',
          healthCondition: '',
          incomeSource: '',
          immediateNeeds: '',
          longTermNeeds: '',
          recommendations: '',
          followUpDate: '',
        });
        fetchVisits();
      } else {
        alert('Failed to save home visit');
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Failed to save home visit');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'follow-up':
        return 'bg-yellow-100 text-yellow-800';
      case 'urgent':
        return 'bg-red-100 text-red-800';
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
          <span>New Home Visit</span>
        </button>
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-8">Home Visits</h1>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Record Home Visit</h2>
            <button
              onClick={() => setShowForm(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Beneficiary Name *
                </label>
                <input
                  type="text"
                  value={formData.beneficiaryName}
                  onChange={(e) => setFormData(prev => ({ ...prev, beneficiaryName: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Family Size
                </label>
                <input
                  type="number"
                  value={formData.familySize}
                  onChange={(e) => setFormData(prev => ({ ...prev, familySize: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Living Conditions Assessment
              </label>
              <select
                value={formData.livingConditions}
                onChange={(e) => setFormData(prev => ({ ...prev, livingConditions: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select living conditions</option>
                <option value="excellent">Excellent - Well maintained home</option>
                <option value="good">Good - Adequate living conditions</option>
                <option value="fair">Fair - Basic living conditions</option>
                <option value="poor">Poor - Substandard living conditions</option>
                <option value="critical">Critical - Urgent housing needs</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Main Challenges Faced by Family
              </label>
              <textarea
                value={formData.mainChallenges}
                onChange={(e) => setFormData(prev => ({ ...prev, mainChallenges: e.target.value }))}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe the main challenges (e.g., lack of food, medical issues, unemployment, etc.)"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Health Condition Assessment
                </label>
                <select
                  value={formData.healthCondition}
                  onChange={(e) => setFormData(prev => ({ ...prev, healthCondition: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select health condition</option>
                  <option value="excellent">Excellent - No health issues</option>
                  <option value="good">Good - Minor health concerns</option>
                  <option value="fair">Fair - Manageable health conditions</option>
                  <option value="poor">Poor - Serious health issues</option>
                  <option value="critical">Critical - Urgent medical attention needed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Primary Income Source
                </label>
                <select
                  value={formData.incomeSource}
                  onChange={(e) => setFormData(prev => ({ ...prev, incomeSource: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select income source</option>
                  <option value="employment">Employment/Salary</option>
                  <option value="farming">Farming/Agriculture</option>
                  <option value="business">Small Business</option>
                  <option value="remittances">Family Remittances</option>
                  <option value="government">Government Support</option>
                  <option value="charity">Charity/Relief</option>
                  <option value="none">No regular income</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Immediate Needs (1-3 months)
                </label>
                <textarea
                  value={formData.immediateNeeds}
                  onChange={(e) => setFormData(prev => ({ ...prev, immediateNeeds: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Food, medical supplies, temporary shelter, etc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Long-term Needs (6+ months)
                </label>
                <textarea
                  value={formData.longTermNeeds}
                  onChange={(e) => setFormData(prev => ({ ...prev, longTermNeeds: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Education support, sustainable income, housing improvement, etc."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tzu Chi Recommendations & Action Plan
              </label>
              <textarea
                value={formData.recommendations}
                onChange={(e) => setFormData(prev => ({ ...prev, recommendations: e.target.value }))}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Recommended support, follow-up actions, coordination with other services, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Follow-up Date
              </label>
              <input
                type="date"
                value={formData.followUpDate}
                onChange={(e) => setFormData(prev => ({ ...prev, followUpDate: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end space-x-4">
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
                Save Home Visit
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Visits List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visits.map((visit) => (
          <div key={visit.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Home className="w-8 h-8 text-blue-500" />
                <div>
                  <h3 className="font-semibold text-gray-800">{visit.beneficiaryName}</h3>
                  <p className="text-sm text-gray-500">
                    Family of {visit.familySize || 'Unknown size'}
                  </p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(visit.status)}`}>
                {visit.status}
              </span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Heart className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Health: {visit.healthCondition || 'Not assessed'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Income: {visit.incomeSource || 'Not specified'}</span>
              </div>
              {visit.mainChallenges && (
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5" />
                  <span className="text-gray-600 text-xs">{visit.mainChallenges}</span>
                </div>
              )}
              {visit.followUpDate && (
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-gray-600 text-xs">
                    Follow-up: {new Date(visit.followUpDate).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Recorded on {new Date(visit.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {visits.length === 0 && (
        <div className="text-center py-12">
          <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No home visits recorded yet</h3>
          <p className="text-gray-500">Start by recording your first home visit assessment.</p>
        </div>
      )}
    </div>
  );
}