'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewMaterialPage() {
  const [formData, setFormData] = useState({
    itemName: '',
    category: '',
    quantityReceived: '',
    quantityUsed: '',
    stockStatus: 'In Stock',
    dateReceived: new Date().toISOString().split('T')[0],
    receivedFrom: '',
    issuedTo: '',
    purposeOfUse: '',
    storageLocation: '',
    remarks: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const quantityRemaining = parseInt(formData.quantityReceived) - parseInt(formData.quantityUsed || '0');

      const response = await fetch('/api/materials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          quantityReceived: parseInt(formData.quantityReceived),
          quantityUsed: parseInt(formData.quantityUsed || '0'),
          quantityRemaining,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Failed to add material');
        return;
      }

      router.push('/materials');
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'Food Items',
    'Non-Food Items',
  ];

  const stockStatuses = ['In Stock', 'Low Stock', 'Out of Stock'];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        href="/materials"
        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-6"
      >
        <ArrowLeft size={20} />
        <span>Back to Materials</span>
      </Link>

      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Add New Material</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Item Name and Category Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="itemName" className="block text-sm font-medium text-gray-700 mb-1">
                Item Name *
              </label>
              <input
                type="text"
                id="itemName"
                name="itemName"
                value={formData.itemName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quantities Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="quantityReceived" className="block text-sm font-medium text-gray-700 mb-1">
                Quantity Received *
              </label>
              <input
                type="number"
                id="quantityReceived"
                name="quantityReceived"
                value={formData.quantityReceived}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                required
              />
            </div>

            <div>
              <label htmlFor="quantityUsed" className="block text-sm font-medium text-gray-700 mb-1">
                Quantity Used
              </label>
              <input
                type="number"
                id="quantityUsed"
                name="quantityUsed"
                value={formData.quantityUsed}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
            </div>

            <div>
              <label htmlFor="stockStatus" className="block text-sm font-medium text-gray-700 mb-1">
                Stock Status *
              </label>
              <select
                id="stockStatus"
                name="stockStatus"
                value={formData.stockStatus}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                {stockStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date and Received From Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="dateReceived" className="block text-sm font-medium text-gray-700 mb-1">
                Date Received *
              </label>
              <input
                type="date"
                id="dateReceived"
                name="dateReceived"
                value={formData.dateReceived}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="receivedFrom" className="block text-sm font-medium text-gray-700 mb-1">
                Received From
              </label>
              <input
                type="text"
                id="receivedFrom"
                name="receivedFrom"
                value={formData.receivedFrom}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Donor/Supplier name"
              />
            </div>
          </div>

          {/* Issued To and Purpose Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="issuedTo" className="block text-sm font-medium text-gray-700 mb-1">
                Issued To
              </label>
              <input
                type="text"
                id="issuedTo"
                name="issuedTo"
                value={formData.issuedTo}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Who received the items"
              />
            </div>

            <div>
              <label htmlFor="purposeOfUse" className="block text-sm font-medium text-gray-700 mb-1">
                Purpose of Use
              </label>
              <input
                type="text"
                id="purposeOfUse"
                name="purposeOfUse"
                value={formData.purposeOfUse}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="How the items will be used"
              />
            </div>
          </div>

          {/* Storage Location */}
          <div>
            <label htmlFor="storageLocation" className="block text-sm font-medium text-gray-700 mb-1">
              Storage Location
            </label>
            <input
              type="text"
              id="storageLocation"
              name="storageLocation"
              value={formData.storageLocation}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Where the items are stored"
            />
          </div>

          {/* Remarks */}
          <div>
            <label htmlFor="remarks" className="block text-sm font-medium text-gray-700 mb-1">
              Remarks
            </label>
            <textarea
              id="remarks"
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Additional notes..."
            />
          </div>

          {/* Buttons */}
          <div className="flex space-x-4 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              {loading ? 'Saving...' : 'Add Material'}
            </button>
            <Link
              href="/materials"
              className="flex-1 text-center bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}