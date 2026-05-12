'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Users, FileUp, AlertCircle, X, Search, Download, Edit, Trash2 } from 'lucide-react';

interface BeneficiaryRecord {
  id: string;
  name: string;
  identifier: string;
  phone: string;
  address: string;
  familySize: number;
  category: string;
  needDescription: string;
  priority: string;
  status: string;
  registrationDate: string;
  assessmentNotes: string;
  supportProvided: string;
  targetSupport: string;
  createdAt: string;
  userId: string;
}

export default function BeneficiaryManagementPage() {
  const [beneficiaries, setBeneficiaries] = useState<BeneficiaryRecord[]>([]);
  const [filteredBeneficiaries, setFilteredBeneficiaries] = useState<BeneficiaryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    identifier: '',
    phone: '',
    address: '',
    familySize: '',
    category: '',
    needDescription: '',
    priority: '',
    status: 'active',
    registrationDate: new Date().toISOString().split('T')[0],
    assessmentNotes: '',
    supportProvided: '',
    targetSupport: '',
  });

  useEffect(() => {
    fetchBeneficiaries();
  }, []);

  useEffect(() => {
    filterBeneficiaries();
  }, [beneficiaries, searchTerm, filterCategory, filterPriority]);

  const fetchBeneficiaries = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/beneficiary-management', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      setBeneficiaries(data.beneficiaries || []);
    } catch (error) {
      console.error('Failed to fetch beneficiaries:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterBeneficiaries = () => {
    let filtered = beneficiaries;

    if (searchTerm) {
      filtered = filtered.filter(b =>
        b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.identifier.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.phone.includes(searchTerm)
      );
    }

    if (filterCategory !== 'all') {
      filtered = filtered.filter(b => b.category === filterCategory);
    }

    if (filterPriority !== 'all') {
      filtered = filtered.filter(b => b.priority === filterPriority);
    }

    setFilteredBeneficiaries(filtered);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/beneficiary-management', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          identifier: formData.identifier,
          phone: formData.phone,
          address: formData.address,
          familySize: parseInt(formData.familySize),
          category: formData.category,
          needDescription: formData.needDescription,
          priority: formData.priority,
          status: formData.status,
          registrationDate: new Date(formData.registrationDate),
          assessmentNotes: formData.assessmentNotes,
          supportProvided: formData.supportProvided,
          targetSupport: formData.targetSupport,
        }),
      });

      if (response.ok) {
        setShowForm(false);
        resetForm();
        fetchBeneficiaries();
      } else {
        alert('Failed to save beneficiary');
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Failed to save beneficiary');
    }
  };

  const handleBulkImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simple CSV parser without external dependencies
    const parseCSV = (text: string) => {
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      const records = [];

      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const values = lines[i].split(',').map(v => v.trim());
        const record: any = {};
        headers.forEach((header, index) => {
          record[header] = values[index] || '';
        });
        records.push(record);
      }
      return records;
    };

    try {
      const text = await file.text();
      const records = parseCSV(text);

      if (records.length === 0) {
        alert('No valid records found in CSV file');
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) return;

      // Bulk import API call
      const response = await fetch('/api/beneficiary-management/bulk-import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ records }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Successfully imported ${data.importedCount} beneficiaries`);
        setShowBulkImport(false);
        fetchBeneficiaries();
      } else {
        alert('Failed to import records');
      }
    } catch (error) {
      console.error('Import error:', error);
      alert('Failed to import records: ' + (error as Error).message);
    }
  };

  const downloadTemplate = () => {
    const template = 'name,identifier,phone,address,familySize,category,priority,needDescription,targetSupport\n' +
      'John Doe,BEN-001,0999123456,Lilongwe District,5,elderly,high,Lives alone,Food assistance\n' +
      'Jane Smith,BEN-002,0999654321,Blantyre District,3,vulnerable,medium,Single mother,Shelter support\n';

    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'beneficiary_template.csv';
    a.click();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      identifier: '',
      phone: '',
      address: '',
      familySize: '',
      category: '',
      needDescription: '',
      priority: '',
      status: 'active',
      registrationDate: new Date().toISOString().split('T')[0],
      assessmentNotes: '',
      supportProvided: '',
      targetSupport: '',
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'elderly':
        return 'bg-blue-100 text-blue-800';
      case 'vulnerable':
        return 'bg-red-100 text-red-800';
      case 'children':
        return 'bg-yellow-100 text-yellow-800';
      case 'disabled':
        return 'bg-purple-100 text-purple-800';
      case 'low-income':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
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
        <div className="flex gap-2">
          <button
            onClick={() => setShowBulkImport(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
          >
            <FileUp size={20} />
            <span>Import List</span>
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>New Beneficiary</span>
          </button>
        </div>
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-8">Beneficiary Management</h1>

      {/* Bulk Import Modal */}
      {showBulkImport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Import Beneficiary List</h2>
              <button
                onClick={() => setShowBulkImport(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-700">
                <p className="font-semibold mb-1">CSV Format Required</p>
                <p>File must contain: name, identifier, phone, address, familySize, category, priority, needDescription, targetSupport</p>
              </div>
            </div>

            <input
              type="file"
              accept=".csv"
              onChange={handleBulkImport}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
            />

            <button
              onClick={downloadTemplate}
              className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 flex items-center justify-center space-x-2 mb-4"
            >
              <Download size={18} />
              <span>Download Template</span>
            </button>

            <button
              onClick={() => setShowBulkImport(false)}
              className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Register New Beneficiary</h2>
            <button
              onClick={() => {
                setShowForm(false);
                resetForm();
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter beneficiary name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Beneficiary ID/Reference Number
                  </label>
                  <input
                    type="text"
                    value={formData.identifier}
                    onChange={(e) => setFormData(prev => ({ ...prev, identifier: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., BEN-001"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0999123456"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Family Size *
                  </label>
                  <input
                    type="number"
                    value={formData.familySize}
                    onChange={(e) => setFormData(prev => ({ ...prev, familySize: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address/Location *
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="District, Village, Specific location"
                  required
                />
              </div>
            </div>

            {/* Beneficiary Category */}
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Beneficiary Classification</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Beneficiary Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select category</option>
                    <option value="elderly">Elderly (60+)</option>
                    <option value="vulnerable">Vulnerable Persons</option>
                    <option value="children">Children/Orphans</option>
                    <option value="disabled">Persons with Disabilities</option>
                    <option value="low-income">Low-Income Families</option>
                    <option value="widows">Widows/Widowers</option>
                    <option value="chronically-ill">Chronically Ill</option>
                    <option value="disaster-affected">Disaster Affected</option>
                  </select>
                </div>
                <div>
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
                    <option value="high">High - Urgent needs</option>
                    <option value="medium">Medium - Standard need</option>
                    <option value="low">Low - Non-urgent</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Needs Assessment */}
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Needs Assessment</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  What are their primary needs? *
                </label>
                <textarea
                  value={formData.needDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, needDescription: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe the beneficiary's primary needs (food, shelter, medical, education, etc.)"
                  required
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assessment Notes
                </label>
                <textarea
                  value={formData.assessmentNotes}
                  onChange={(e) => setFormData(prev => ({ ...prev, assessmentNotes: e.target.value }))}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Additional observations from assessment visit"
                />
              </div>
            </div>

            {/* Support Information */}
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Support Information</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  What support have they already received?
                </label>
                <textarea
                  value={formData.supportProvided}
                  onChange={(e) => setFormData(prev => ({ ...prev, supportProvided: e.target.value }))}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Previous assistance provided"
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Support Needed *
                </label>
                <textarea
                  value={formData.targetSupport}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetSupport: e.target.value }))}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe the support plan and timeline"
                  required
                />
              </div>
            </div>

            {/* Registration Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Registration Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Registration Date
                  </label>
                  <input
                    type="date"
                    value={formData.registrationDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, registrationDate: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="completed">Support Completed</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Register Beneficiary
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex flex-wrap gap-4">
        <div className="flex-1 min-w-48">
          <input
            type="text"
            placeholder="Search by name, ID, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Categories</option>
          <option value="elderly">Elderly</option>
          <option value="vulnerable">Vulnerable</option>
          <option value="children">Children</option>
          <option value="disabled">Disabled</option>
          <option value="low-income">Low-Income</option>
        </select>
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* Beneficiaries List */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-lg shadow-md">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Priority</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Phone</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Location</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredBeneficiaries.map((beneficiary) => (
              <tr key={beneficiary.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">{beneficiary.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{beneficiary.identifier}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(beneficiary.category)}`}>
                    {beneficiary.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(beneficiary.priority)}`}>
                    {beneficiary.priority}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{beneficiary.phone}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{beneficiary.address}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    beneficiary.status === 'active' ? 'bg-green-100 text-green-800' : 
                    beneficiary.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {beneficiary.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <button className="text-blue-600 hover:text-blue-800 mr-3">
                    <Edit size={18} />
                  </button>
                  <button className="text-red-600 hover:text-red-800">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredBeneficiaries.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {beneficiaries.length === 0 ? 'No beneficiaries registered yet' : 'No matching beneficiaries found'}
          </h3>
          <p className="text-gray-500">
            {beneficiaries.length === 0 ? 'Start by registering your first beneficiary.' : 'Try adjusting your filters.'}
          </p>
        </div>
      )}

      <div className="mt-6 text-center text-sm text-gray-600">
        Showing {filteredBeneficiaries.length} of {beneficiaries.length} beneficiaries
      </div>
    </div>
  );
}