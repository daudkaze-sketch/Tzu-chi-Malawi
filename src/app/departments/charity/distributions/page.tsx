'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Truck, MapPin, Users, Package, X, CheckCircle, Edit2, Trash2 } from 'lucide-react';

interface Distribution {
  id: string;
  beneficiaryName: string;
  beneficiaryId?: string;
  itemsReceived: string;
  quantity: number;
  signature?: string;
  location: string;
  villageName: string;
  district: string;
  date: string;
  distributionType: string;
  purpose: string;
  followUpNeeded: boolean;
  notes?: string;
  createdAt: string;
  userId: string;
}

export default function DistributionsPage() {
  const [distributions, setDistributions] = useState<Distribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState('');
  const [formData, setFormData] = useState({
    beneficiaryName: '',
    beneficiaryId: '',
    itemsReceived: '',
    quantity: '',
    signature: '',
    location: '',
    villageName: '',
    district: '',
    date: new Date().toISOString().split('T')[0],
    distributionType: '',
    purpose: '',
    followUpNeeded: false,
    notes: '',
  });

  useEffect(() => {
    fetchDistributions();
  }, []);

  const fetchDistributions = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/relief-distributions', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      setDistributions(data.distributions || []);
    } catch (error) {
      console.error('Failed to fetch distributions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const url = editingId 
        ? `/api/relief-distributions/${editingId}` 
        : '/api/relief-distributions';
      const method = editingId ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          beneficiaryName: formData.beneficiaryName,
          beneficiaryId: formData.beneficiaryId || null,
          itemsReceived: formData.itemsReceived,
          quantity: parseInt(formData.quantity),
          signature: formData.signature || null,
          location: formData.location,
          villageName: formData.villageName,
          district: formData.district,
          date: new Date(formData.date),
          distributionType: formData.distributionType,
          purpose: formData.purpose,
          followUpNeeded: formData.followUpNeeded,
          notes: formData.notes || null,
        }),
      });

      if (response.ok) {
        setShowForm(false);
        setEditingId('');
        setFormData({
          beneficiaryName: '',
          beneficiaryId: '',
          itemsReceived: '',
          quantity: '',
          signature: '',
          location: '',
          villageName: '',
          district: '',
          date: new Date().toISOString().split('T')[0],
          distributionType: '',
          purpose: '',
          followUpNeeded: false,
          notes: '',
        });
        fetchDistributions();
      } else {
        alert('Failed to save distribution');
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Failed to save distribution');
    }
  };

  const handleDeleteDistribution = async (id: string) => {
    if (!confirm('Are you sure you want to delete this distribution record?')) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`/api/relief-distributions/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        fetchDistributions();
      } else {
        alert('Failed to delete distribution');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete distribution');
    }
  };

  const handleEditDistribution = (distribution: Distribution) => {
    setFormData({
      beneficiaryName: distribution.beneficiaryName,
      beneficiaryId: distribution.beneficiaryId || '',
      itemsReceived: distribution.itemsReceived,
      quantity: distribution.quantity.toString(),
      signature: distribution.signature || '',
      location: distribution.location,
      villageName: distribution.villageName,
      district: distribution.district,
      date: distribution.date.split('T')[0],
      distributionType: distribution.distributionType,
      purpose: distribution.purpose,
      followUpNeeded: distribution.followUpNeeded,
      notes: distribution.notes || '',
    });
    setEditingId(distribution.id);
    setShowForm(true);
  };

  const getDistributionTypeColor = (type: string) => {
    switch (type) {
      case 'food':
        return 'bg-orange-100 text-orange-800';
      case 'medical':
        return 'bg-red-100 text-red-800';
      case 'clothing':
        return 'bg-blue-100 text-blue-800';
      case 'educational':
        return 'bg-green-100 text-green-800';
      case 'shelter':
        return 'bg-purple-100 text-purple-800';
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
          <span>New Distribution</span>
        </button>
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-8">Distribution Activities</h1>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              {editingId ? 'Edit Distribution Activity' : 'Record Distribution Activity'}
            </h2>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingId('');
                setFormData({
                  beneficiaryName: '',
                  beneficiaryId: '',
                  itemsReceived: '',
                  quantity: '',
                  signature: '',
                  location: '',
                  villageName: '',
                  district: '',
                  date: new Date().toISOString().split('T')[0],
                  distributionType: '',
                  purpose: '',
                  followUpNeeded: false,
                  notes: '',
                });
              }}
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
                  Beneficiary ID (Optional)
                </label>
                <input
                  type="text"
                  value={formData.beneficiaryId}
                  onChange={(e) => setFormData(prev => ({ ...prev, beneficiaryId: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., BEN-001"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Items Received *
                </label>
                <input
                  type="text"
                  value={formData.itemsReceived}
                  onChange={(e) => setFormData(prev => ({ ...prev, itemsReceived: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Rice, Cooking Oil, Soap"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity *
                </label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Village Name *
                </label>
                <input
                  type="text"
                  value={formData.villageName}
                  onChange={(e) => setFormData(prev => ({ ...prev, villageName: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Chilinde Village"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  District *
                </label>
                <select
                  value={formData.district}
                  onChange={(e) => setFormData(prev => ({ ...prev, district: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select District</option>
                  <option value="Lilongwe">Lilongwe</option>
                  <option value="Blantyre">Blantyre</option>
                  <option value="Mzuzu">Mzuzu</option>
                  <option value="Zomba">Zomba</option>
                  <option value="Kasungu">Kasungu</option>
                  <option value="Mangochi">Mangochi</option>
                  <option value="Karonga">Karonga</option>
                  <option value="Salima">Salima</option>
                  <option value="Nkhotakota">Nkhotakota</option>
                  <option value="Chitipa">Chitipa</option>
                  <option value="Thyolo">Thyolo</option>
                  <option value="Mchinji">Mchinji</option>
                  <option value="Dedza">Dedza</option>
                  <option value="Ntcheu">Ntcheu</option>
                  <option value="Balaka">Balaka</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specific Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Community Center, School"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Distribution Type *
                </label>
                <select
                  value={formData.distributionType}
                  onChange={(e) => setFormData(prev => ({ ...prev, distributionType: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select type</option>
                  <option value="food">Food Aid</option>
                  <option value="medical">Medical Supplies</option>
                  <option value="clothing">Clothing</option>
                  <option value="educational">Educational Materials</option>
                  <option value="shelter">Shelter Materials</option>
                  <option value="hygiene">Hygiene Kits</option>
                  <option value="agricultural">Agricultural Support</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Purpose *
                </label>
                <select
                  value={formData.purpose}
                  onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select purpose</option>
                  <option value="emergency">Emergency Relief</option>
                  <option value="poverty">Poverty Alleviation</option>
                  <option value="disaster">Disaster Response</option>
                  <option value="seasonal">Seasonal Support</option>
                  <option value="health">Health Crisis</option>
                  <option value="education">Educational Support</option>
                  <option value="rehabilitation">Rehabilitation</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Beneficiary Signature
                </label>
                <input
                  type="text"
                  value={formData.signature}
                  onChange={(e) => setFormData(prev => ({ ...prev, signature: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Signature or thumbprint recorded"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Any additional observations or follow-up requirements"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="followUpNeeded"
                checked={formData.followUpNeeded}
                onChange={(e) => setFormData(prev => ({ ...prev, followUpNeeded: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="followUpNeeded" className="text-sm text-gray-700">
                Follow-up visit needed
              </label>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId('');
                  setFormData({
                    beneficiaryName: '',
                    beneficiaryId: '',
                    itemsReceived: '',
                    quantity: '',
                    signature: '',
                    location: '',
                    villageName: '',
                    district: '',
                    date: new Date().toISOString().split('T')[0],
                    distributionType: '',
                    purpose: '',
                    followUpNeeded: false,
                    notes: '',
                  });
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {editingId ? 'Update Distribution' : 'Save Distribution'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Distributions List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {distributions.map((dist) => (
          <div key={dist.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3 flex-1">
                <Truck className="w-8 h-8 text-green-500" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{dist.beneficiaryName}</h3>
                  <p className="text-sm text-gray-500">{dist.villageName}, {dist.district}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDistributionTypeColor(dist.distributionType)}`}>
                  {dist.distributionType}
                </span>
                <button
                  onClick={() => handleEditDistribution(dist)}
                  className="text-blue-600 hover:text-blue-800 p-1"
                  title="Edit"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDeleteDistribution(dist.id)}
                  className="text-red-600 hover:text-red-800 p-1"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Package className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{dist.itemsReceived} ({dist.quantity})</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{dist.location || 'General distribution'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{dist.purpose}</span>
              </div>
              {dist.followUpNeeded && (
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-blue-500" />
                  <span className="text-blue-600 text-xs">Follow-up needed</span>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Distributed on {new Date(dist.date).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {distributions.length === 0 && (
        <div className="text-center py-12">
          <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No distributions recorded yet</h3>
          <p className="text-gray-500">Start by recording your first relief distribution activity.</p>
        </div>
      )}
    </div>
  );
}