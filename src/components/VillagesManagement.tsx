'use client';

import { useState, useEffect } from 'react';
import { MapPin, Plus, Edit2, Trash2, Users, X, Calendar } from 'lucide-react';

interface Village {
  id: string;
  name: string;
  district: string;
  activeVolunteers: number;
  createdAt: string;
  updatedAt: string;
  isEdited: boolean;
}

interface VillageWithEdit extends Village {
  isEditing?: boolean;
}

export default function VillagesManagementCard() {
  const [villages, setVillages] = useState<VillageWithEdit[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    district: '',
    activeVolunteers: '',
  });

  useEffect(() => {
    fetchVillages();
  }, []);

  const fetchVillages = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/villages', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      setVillages(data.villages || []);
    } catch (error) {
      console.error('Failed to fetch villages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddVillage = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/villages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          district: formData.district,
          activeVolunteers: parseInt(formData.activeVolunteers),
        }),
      });

      if (response.ok) {
        setShowForm(false);
        setFormData({ name: '', district: '', activeVolunteers: '' });
        fetchVillages();
      }
    } catch (error) {
      console.error('Error adding village:', error);
    }
  };

  const handleEditVillage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`/api/villages/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          district: formData.district,
          activeVolunteers: parseInt(formData.activeVolunteers),
        }),
      });

      if (response.ok) {
        setEditingId(null);
        setFormData({ name: '', district: '', activeVolunteers: '' });
        fetchVillages();
      }
    } catch (error) {
      console.error('Error editing village:', error);
    }
  };

  const handleDeleteVillage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this village?')) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`/api/villages/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        fetchVillages();
      }
    } catch (error) {
      console.error('Error deleting village:', error);
    }
  };

  const startEdit = (village: Village) => {
    setEditingId(village.id);
    setFormData({
      name: village.name,
      district: village.district,
      activeVolunteers: village.activeVolunteers.toString(),
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <MapPin className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Villages & Volunteers</h2>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({ name: '', district: '', activeVolunteers: '' });
            setShowForm(!showForm);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={18} />
          Add Village
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <form onSubmit={editingId ? handleEditVillage : handleAddVillage} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Village Name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <select
                value={formData.district}
                onChange={(e) => setFormData(prev => ({ ...prev, district: e.target.value }))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <input
                type="number"
                placeholder="Active Volunteers"
                value={formData.activeVolunteers}
                onChange={(e) => setFormData(prev => ({ ...prev, activeVolunteers: e.target.value }))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                required
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                {editingId ? 'Update Village' : 'Add Village'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
                className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Villages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {villages.map((village) => (
          <div
            key={village.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-gray-800">{village.name}</h3>
                <p className="text-sm text-gray-500">{village.district}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(village)}
                  className="text-blue-600 hover:text-blue-800 p-1"
                  title="Edit"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDeleteVillage(village.id)}
                  className="text-red-600 hover:text-red-800 p-1"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-gray-800">{village.activeVolunteers}</span>
                <span className="text-sm text-gray-600">Active Volunteers</span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500 space-y-1">
              <div className="flex items-center gap-1">
                <Calendar size={12} />
                <span>Created: {new Date(village.createdAt).toLocaleDateString()}</span>
              </div>
              {village.isEdited && (
                <div className="flex items-center gap-1 text-blue-600">
                  <Edit2 size={12} />
                  <span>Edited: {new Date(village.updatedAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {villages.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <MapPin className="w-12 h-12 mx-auto mb-2 opacity-30" />
          <p>No villages registered yet. Add your first village to get started.</p>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600">
        Total Villages: <span className="font-semibold">{villages.length}</span> | 
        Total Volunteers: <span className="font-semibold">{villages.reduce((sum, v) => sum + v.activeVolunteers, 0)}</span>
      </div>
    </div>
  );
}