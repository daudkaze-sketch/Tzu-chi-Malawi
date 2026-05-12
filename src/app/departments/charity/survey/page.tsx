'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, MapPin, BarChart3, AlertTriangle, Clipboard, X, Upload, FileText, Trash, Edit2 } from 'lucide-react';

interface SurveyRecord {
  id: string;
  surveyTitle: string;
  surveyType: string;
  areaName: string;
  district: string;
  date: string;
  surveyPersonName: string;
  surveyPersonRole: string;
  isVolunteer: boolean;
  affectedPeople: number;
  householdsAffected: number;
  volunteersAffected: number;
  volunteerHouseholdsAffected: number;
  mainChallenges: string;
  immediateNeeds: string;
  waterAccess: string;
  foodSituation: string;
  healthStatus: string;
  shelterCondition: string;
  infrastructureDamage: string;
  livestock: string;
  crops: string;
  economicImpact: string;
  vulnerablePeople: string;
  accessibilityRating: string;
  securityStatus: string;
  governmentResponse: string;
  recommendations: string;
  attachments: string;
  priority: string;
  createdAt: string;
  userId: string;
}

export default function SurveyPage() {
  const [surveys, setSurveys] = useState<SurveyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState('');
  const [expandedSurvey, setExpandedSurvey] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    surveyTitle: '',
    surveyType: '',
    areaName: '',
    district: '',
    date: new Date().toISOString().split('T')[0],
    surveyPersonName: '',
    surveyPersonRole: '',
    isVolunteer: false,
    affectedPeople: '',
    householdsAffected: '',
    volunteersAffected: '',
    volunteerHouseholdsAffected: '',
    mainChallenges: '',
    immediateNeeds: '',
    waterAccess: '',
    foodSituation: '',
    healthStatus: '',
    shelterCondition: '',
    infrastructureDamage: '',
    livestock: '',
    crops: '',
    economicImpact: '',
    vulnerablePeople: '',
    accessibilityRating: '',
    securityStatus: '',
    governmentResponse: '',
    recommendations: '',
    priority: '',
  });

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/surveys', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      setSurveys(data.surveys || []);
    } catch (error) {
      console.error('Failed to fetch surveys:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // Use FormData to support file uploads
      const formDataToSend = new FormData();
      formDataToSend.append('surveyTitle', formData.surveyTitle);
      formDataToSend.append('surveyType', formData.surveyType);
      formDataToSend.append('areaName', formData.areaName);
      formDataToSend.append('district', formData.district);
      formDataToSend.append('date', formData.date);
      formDataToSend.append('surveyPersonName', formData.surveyPersonName);
      formDataToSend.append('surveyPersonRole', formData.surveyPersonRole);
      formDataToSend.append('isVolunteer', formData.isVolunteer.toString());
      formDataToSend.append('affectedPeople', formData.affectedPeople);
      formDataToSend.append('householdsAffected', formData.householdsAffected);
      formDataToSend.append('volunteersAffected', formData.volunteersAffected);
      formDataToSend.append('volunteerHouseholdsAffected', formData.volunteerHouseholdsAffected);
      formDataToSend.append('mainChallenges', formData.mainChallenges);
      formDataToSend.append('immediateNeeds', formData.immediateNeeds);
      formDataToSend.append('waterAccess', formData.waterAccess);
      formDataToSend.append('foodSituation', formData.foodSituation);
      formDataToSend.append('healthStatus', formData.healthStatus);
      formDataToSend.append('shelterCondition', formData.shelterCondition);
      formDataToSend.append('infrastructureDamage', formData.infrastructureDamage);
      formDataToSend.append('livestock', formData.livestock);
      formDataToSend.append('crops', formData.crops);
      formDataToSend.append('economicImpact', formData.economicImpact);
      formDataToSend.append('vulnerablePeople', formData.vulnerablePeople);
      formDataToSend.append('accessibilityRating', formData.accessibilityRating);
      formDataToSend.append('securityStatus', formData.securityStatus);
      formDataToSend.append('governmentResponse', formData.governmentResponse);
      formDataToSend.append('recommendations', formData.recommendations);
      formDataToSend.append('priority', formData.priority);

      // Append all uploaded files
      uploadedFiles.forEach((file) => {
        formDataToSend.append('attachments', file);
      });

      const url = editingId ? `/api/surveys/${editingId}` : '/api/surveys';
      const method = editingId ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (response.ok) {
        setShowForm(false);
        setEditingId('');
        setUploadedFiles([]);
        resetForm();
        fetchSurveys();
      } else {
        alert('Failed to save survey');
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Failed to save survey');
    }
  };

  const handleEditSurvey = (survey: SurveyRecord) => {
    setFormData({
      surveyTitle: survey.surveyTitle || '',
      surveyType: survey.surveyType || '',
      areaName: survey.areaName || '',
      district: survey.district || '',
      date: survey.date?.split('T')[0] || new Date().toISOString().split('T')[0],
      surveyPersonName: survey.surveyPersonName || '',
      surveyPersonRole: survey.surveyPersonRole || '',
      isVolunteer: survey.isVolunteer || false,
      affectedPeople: survey.affectedPeople?.toString() || '',
      householdsAffected: survey.householdsAffected?.toString() || '',
      volunteersAffected: survey.volunteersAffected?.toString() || '',
      volunteerHouseholdsAffected: survey.volunteerHouseholdsAffected?.toString() || '',
      mainChallenges: survey.mainChallenges || '',
      immediateNeeds: survey.immediateNeeds || '',
      waterAccess: survey.waterAccess || '',
      foodSituation: survey.foodSituation || '',
      healthStatus: survey.healthStatus || '',
      shelterCondition: survey.shelterCondition || '',
      infrastructureDamage: survey.infrastructureDamage || '',
      livestock: survey.livestock || '',
      crops: survey.crops || '',
      economicImpact: survey.economicImpact || '',
      vulnerablePeople: survey.vulnerablePeople || '',
      accessibilityRating: survey.accessibilityRating || '',
      securityStatus: survey.securityStatus || '',
      governmentResponse: survey.governmentResponse || '',
      recommendations: survey.recommendations || '',
      priority: survey.priority || '',
    });
    setEditingId(survey.id);
    setShowForm(true);
  };

  const handleDeleteSurvey = async (id: string) => {
    if (!confirm('Are you sure you want to delete this survey?')) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`/api/surveys/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        fetchSurveys();
      } else {
        alert('Failed to delete survey');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete survey');
    }
  };

  const getSurveyTypeColor = (type: string) => {
    switch (type) {
      case 'disaster':
        return 'bg-red-100 text-red-800';
      case 'community':
        return 'bg-blue-100 text-blue-800';
      case 'health':
        return 'bg-green-100 text-green-800';
      case 'livelihood':
        return 'bg-yellow-100 text-yellow-800';
      case 'nutrition':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const resetForm = () => {
    setFormData({
      surveyTitle: '',
      surveyType: '',
      areaName: '',
      district: '',
      date: new Date().toISOString().split('T')[0],
      surveyPersonName: '',
      surveyPersonRole: '',
      isVolunteer: false,
      affectedPeople: '',
      householdsAffected: '',
      volunteersAffected: '',
      volunteerHouseholdsAffected: '',
      mainChallenges: '',
      immediateNeeds: '',
      waterAccess: '',
      foodSituation: '',
      healthStatus: '',
      shelterCondition: '',
      infrastructureDamage: '',
      livestock: '',
      crops: '',
      economicImpact: '',
      vulnerablePeople: '',
      accessibilityRating: '',
      securityStatus: '',
      governmentResponse: '',
      recommendations: '',
      priority: '',
    });
    setUploadedFiles([]);
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
          <span>New Survey</span>
        </button>
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-8">Survey & Assessment</h1>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6 sticky top-0 bg-white z-10">
            <h2 className="text-xl font-semibold">
              {editingId ? 'Edit Survey Assessment' : 'Conduct Survey Assessment'}
            </h2>
            <button
              onClick={() => {
                setShowForm(false);
                resetForm();
                setEditingId('');
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Survey Information */}
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <Clipboard size={20} />
                Survey Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Survey Title *
                  </label>
                  <input
                    type="text"
                    value={formData.surveyTitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, surveyTitle: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Flood Impact Assessment - Lilongwe"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Survey Type *
                  </label>
                  <select
                    value={formData.surveyType}
                    onChange={(e) => setFormData(prev => ({ ...prev, surveyType: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select type</option>
                    <option value="disaster">Disaster Assessment</option>
                    <option value="community">Community Needs Assessment</option>
                    <option value="health">Health Status Survey</option>
                    <option value="livelihood">Livelihood Impact Assessment</option>
                    <option value="nutrition">Nutrition & Food Security</option>
                    <option value="environmental">Environmental Assessment</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Surveyor Information */}
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Surveyor Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Surveyor Name *
                  </label>
                  <input
                    type="text"
                    value={formData.surveyPersonName}
                    onChange={(e) => setFormData(prev => ({ ...prev, surveyPersonName: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Full name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role/Title *
                  </label>
                  <input
                    type="text"
                    value={formData.surveyPersonRole}
                    onChange={(e) => setFormData(prev => ({ ...prev, surveyPersonRole: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Relief Coordinator"
                    required
                  />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isVolunteer"
                  checked={formData.isVolunteer}
                  onChange={(e) => setFormData(prev => ({ ...prev, isVolunteer: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <label htmlFor="isVolunteer" className="text-sm text-gray-700">
                  This person is a volunteer (not staff)
                </label>
              </div>
            </div>

            {/* Survey Location and Date */}
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <MapPin size={20} />
                Location & Date
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Area Name *
                  </label>
                  <input
                    type="text"
                    value={formData.areaName}
                    onChange={(e) => setFormData(prev => ({ ...prev, areaName: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Village or area name"
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
                    <option value="">Select district</option>
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
            </div>

            {/* Scale of Impact */}
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <BarChart3 size={20} />
                Scale of Impact
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Number of People Affected *
                  </label>
                  <input
                    type="number"
                    value={formData.affectedPeople}
                    onChange={(e) => setFormData(prev => ({ ...prev, affectedPeople: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Households Affected *
                  </label>
                  <input
                    type="number"
                    value={formData.householdsAffected}
                    onChange={(e) => setFormData(prev => ({ ...prev, householdsAffected: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Volunteers Affected
                  </label>
                  <input
                    type="number"
                    value={formData.volunteersAffected}
                    onChange={(e) => setFormData(prev => ({ ...prev, volunteersAffected: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    placeholder="If volunteers were impacted"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Volunteer Households Affected
                  </label>
                  <input
                    type="number"
                    value={formData.volunteerHouseholdsAffected}
                    onChange={(e) => setFormData(prev => ({ ...prev, volunteerHouseholdsAffected: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    placeholder="If volunteer families were impacted"
                  />
                </div>
              </div>
            </div>

            {/* Main Issues Assessment */}
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <AlertTriangle size={20} />
                Main Issues
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Main Challenges/Issues *
                  </label>
                  <textarea
                    value={formData.mainChallenges}
                    onChange={(e) => setFormData(prev => ({ ...prev, mainChallenges: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe the primary problems affecting the area"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Immediate Needs *
                  </label>
                  <textarea
                    value={formData.immediateNeeds}
                    onChange={(e) => setFormData(prev => ({ ...prev, immediateNeeds: e.target.value }))}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="What needs urgent attention?"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vulnerable People *
                  </label>
                  <textarea
                    value={formData.vulnerablePeople}
                    onChange={(e) => setFormData(prev => ({ ...prev, vulnerablePeople: e.target.value }))}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Who are the most vulnerable? (elderly, children, disabled, widows, etc.)"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Sector Assessment */}
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Sector-Specific Assessment</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Water & Sanitation Status
                  </label>
                  <textarea
                    value={formData.waterAccess}
                    onChange={(e) => setFormData(prev => ({ ...prev, waterAccess: e.target.value }))}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe water access, contamination, sanitation facilities"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Food Security & Nutrition
                  </label>
                  <textarea
                    value={formData.foodSituation}
                    onChange={(e) => setFormData(prev => ({ ...prev, foodSituation: e.target.value }))}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Assess food availability, malnutrition levels, market conditions"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Health Status
                  </label>
                  <textarea
                    value={formData.healthStatus}
                    onChange={(e) => setFormData(prev => ({ ...prev, healthStatus: e.target.value }))}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Disease prevalence, health facility status, medical supplies availability"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Shelter Condition
                  </label>
                  <textarea
                    value={formData.shelterCondition}
                    onChange={(e) => setFormData(prev => ({ ...prev, shelterCondition: e.target.value }))}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe housing conditions, damage, homelessness"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Infrastructure Damage
                  </label>
                  <textarea
                    value={formData.infrastructureDamage}
                    onChange={(e) => setFormData(prev => ({ ...prev, infrastructureDamage: e.target.value }))}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Roads, schools, health facilities, markets - extent of damage"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Livestock & Crops Impact
                  </label>
                  <textarea
                    value={formData.livestock}
                    onChange={(e) => setFormData(prev => ({ ...prev, livestock: e.target.value }))}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Deaths, displacement, disease; crop loss, productivity decline"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Economic Impact
                  </label>
                  <textarea
                    value={formData.economicImpact}
                    onChange={(e) => setFormData(prev => ({ ...prev, economicImpact: e.target.value }))}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Income loss, business disruption, market impact, employment"
                  />
                </div>
              </div>
            </div>

            {/* Operational Assessment */}
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Operational Assessment</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Accessibility Rating
                  </label>
                  <select
                    value={formData.accessibilityRating}
                    onChange={(e) => setFormData(prev => ({ ...prev, accessibilityRating: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select accessibility level</option>
                    <option value="fully-accessible">Fully Accessible - Good roads, no security issues</option>
                    <option value="partially-accessible">Partially Accessible - Some road issues or minor security concerns</option>
                    <option value="difficult">Difficult - Poor roads or significant security concerns</option>
                    <option value="not-accessible">Not Accessible - Blocked roads or extreme security risks</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Security Status
                  </label>
                  <textarea
                    value={formData.securityStatus}
                    onChange={(e) => setFormData(prev => ({ ...prev, securityStatus: e.target.value }))}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Security situation, risks for humanitarian workers, armed groups"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Government Response
                  </label>
                  <textarea
                    value={formData.governmentResponse}
                    onChange={(e) => setFormData(prev => ({ ...prev, governmentResponse: e.target.value }))}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="What is the government doing? Official response, plans, resources"
                  />
                </div>
              </div>
            </div>

            {/* Supporting Media - Photos & Videos */}
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <Upload size={20} />
                Supporting Photos & Videos
              </h3>
              
              <div className="bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg p-6 text-center cursor-pointer hover:bg-blue-100 transition"
                onClick={() => document.getElementById('fileInput')?.click()}>
                <Upload className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <p className="text-sm font-medium text-gray-700 mb-1">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500">PNG, JPG, GIF, MP4, WebM up to 50MB</p>
              </div>
              
              <input
                id="fileInput"
                type="file"
                multiple
                accept="image/*,video/*"
                className="hidden"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  setUploadedFiles([...uploadedFiles, ...files]);
                }}
              />

              {uploadedFiles.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Uploaded Files ({uploadedFiles.length})</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                        <div className="flex items-center gap-2 flex-1">
                          {file.type.startsWith('video') ? (
                            <FileText className="w-4 h-4 text-purple-600" />
                          ) : (
                            <FileText className="w-4 h-4 text-blue-600" />
                          )}
                          <span className="text-sm text-gray-700 truncate">{file.name}</span>
                          <span className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setUploadedFiles(uploadedFiles.filter((_, i) => i !== index))}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-xs text-gray-500 mt-3">
                Upload photos or videos documenting the survey findings. These will be attached to the survey record for evidence and reference.
              </p>
            </div>

            {/* Recommendations */}
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Recommendations & Priority</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recommended Actions *
                </label>
                <textarea
                  value={formData.recommendations}
                  onChange={(e) => setFormData(prev => ({ ...prev, recommendations: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="What should be done? Specific interventions, timeline, resources needed"
                  required
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority Level *
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select priority</option>
                  <option value="critical">Critical - Immediate action required</option>
                  <option value="high">High - Urgent response needed</option>
                  <option value="medium">Medium - Monitor and plan response</option>
                  <option value="low">Low - Standard programming</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4 sticky bottom-0 bg-white">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                  setEditingId('');
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {editingId ? 'Update Survey' : 'Save Survey'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Surveys Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {surveys.map((survey) => (
          <div
            key={survey.id}
            className="bg-white rounded-lg shadow-md p-6 border-l-4"
            style={{
              borderLeftColor:
                survey.priority === 'critical' ? '#dc2626' :
                survey.priority === 'high' ? '#ea580c' :
                survey.priority === 'medium' ? '#eab308' :
                '#22c55e',
            }}
          >
<div className="flex items-start justify-between mb-4 gap-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 text-lg">{survey.surveyTitle}</h3>
                  <p className="text-sm text-gray-500">{survey.areaName}, {survey.district}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditSurvey(survey)}
                    className="text-blue-600 hover:text-blue-800 p-1"
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteSurvey(survey.id)}
                    className="text-red-600 hover:text-red-800 p-1"
                    title="Delete"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSurveyTypeColor(survey.surveyType)}`}>
                {survey.surveyType}
              </span>

            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">{new Date(survey.date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Surveyor:</span>
                <span className="font-medium">{survey.surveyPersonName} {survey.isVolunteer ? '(Volunteer)' : '(Staff)'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">People Affected:</span>
                <span className="font-medium">{survey.affectedPeople}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Households:</span>
                <span className="font-medium">{survey.householdsAffected}</span>
              </div>
              {survey.volunteersAffected && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Volunteers Affected:</span>
                  <span className="font-medium">{survey.volunteersAffected}</span>
                </div>
              )}
              {survey.volunteerHouseholdsAffected && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Volunteer Households:</span>
                  <span className="font-medium">{survey.volunteerHouseholdsAffected}</span>
                </div>
              )}
            </div>

            <div className="border-t pt-3">
              <button
                onClick={() => setExpandedSurvey(expandedSurvey === survey.id ? null : survey.id)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                {expandedSurvey === survey.id ? 'Hide Details' : 'View Details'}
              </button>
            </div>

            {expandedSurvey === survey.id && (
              <div className="mt-4 pt-4 border-t space-y-3 text-sm">
                <div>
                  <p className="font-semibold text-gray-700">Main Challenges:</p>
                  <p className="text-gray-600 line-clamp-2">{survey.mainChallenges}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700">Immediate Needs:</p>
                  <p className="text-gray-600 line-clamp-2">{survey.immediateNeeds}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700">Priority:</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(survey.priority)}`}>
                    {survey.priority}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {surveys.length === 0 && (
        <div className="text-center py-12">
          <Clipboard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No surveys conducted yet</h3>
          <p className="text-gray-500">Start by conducting your first area assessment survey.</p>
        </div>
      )}
    </div>
  );
}