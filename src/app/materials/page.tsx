'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Box, Plus, AlertCircle } from 'lucide-react';

interface Material {
  id: string;
  itemName: string;
  category: string;
  quantityReceived: number;
  quantityUsed: number;
  quantityRemaining: number;
  stockStatus: string;
  dateReceived: string;
  receivedFrom?: string;
  issuedTo?: string;
  purposeOfUse?: string;
  storageLocation?: string;
  remarks?: string;
}

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchMaterials();
  }, [router]);

  const fetchMaterials = async () => {
    try {
      const res = await fetch('/api/materials');
      const data = await res.json();
      setMaterials(data.materials || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isLowStock = (remaining: number) => remaining < 5;

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Inventory Management</h1>
        <Link
          href="/materials/new"
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition"
        >
          <Plus size={20} />
          <span>Add Material</span>
        </Link>
      </div>

      {materials.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <Box size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 mb-4">No materials in inventory</p>
          <Link
            href="/materials/new"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg"
          >
            Add First Material
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-300">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Item</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Received</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Used</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Remaining</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Received From</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Storage</th>
              </tr>
            </thead>
            <tbody>
              {materials.map((material) => (
                <tr key={material.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">{material.itemName}</td>
                  <td className="px-6 py-4 text-gray-600">{material.category}</td>
                  <td className="px-6 py-4 text-gray-600">{material.quantityReceived}</td>
                  <td className="px-6 py-4 text-gray-600">{material.quantityUsed}</td>
                  <td className="px-6 py-4 text-gray-600">{material.quantityRemaining}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      material.stockStatus === 'In Stock' ? 'text-green-600 bg-green-100' :
                      material.stockStatus === 'Low Stock' ? 'text-yellow-600 bg-yellow-100' :
                      'text-red-600 bg-red-100'
                    }`}>
                      {material.stockStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">{material.receivedFrom || '-'}</td>
                  <td className="px-6 py-4 text-gray-600 text-sm">{material.storageLocation || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
