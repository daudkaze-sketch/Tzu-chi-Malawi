'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Box, Plus } from 'lucide-react';
import { ExportOptions, type ExportColumn } from '@/components/ExportOptions';

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

const materialColumns: ExportColumn<Material>[] = [
  { header: 'Item', accessor: 'itemName' },
  { header: 'Category', accessor: 'category' },
  { header: 'Quantity Received', accessor: 'quantityReceived' },
  { header: 'Quantity Used', accessor: 'quantityUsed' },
  { header: 'Quantity Remaining', accessor: 'quantityRemaining' },
  { header: 'Stock Status', accessor: 'stockStatus' },
  { header: 'Date Received', accessor: (material) => formatDate(material.dateReceived) },
  { header: 'Received From', accessor: (material) => material.receivedFrom || '-' },
  { header: 'Issued To', accessor: (material) => material.issuedTo || '-' },
  { header: 'Storage', accessor: (material) => material.storageLocation || '-' },
  { header: 'Remarks', accessor: (material) => material.remarks || '-' },
];

function formatDate(value: string) {
  return new Date(value).toLocaleDateString();
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

  if (loading) return <div className="flex min-h-screen items-center justify-center text-sm font-medium text-gray-500">Loading inventory...</div>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
            Inventory
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-950">
            Inventory Management
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-600">
            Track incoming materials, stock movement, storage locations, and replenishment risk.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {materials.length > 0 && (
            <ExportOptions
              columns={materialColumns}
              data={materials}
              fileName="inventory-management"
              title="Inventory Management"
            />
          )}
          <Link
            href="/materials/new"
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-blue-700 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800"
          >
            <Plus size={18} />
            <span>Add Material</span>
          </Link>
        </div>
      </div>

      {materials.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center shadow-sm">
          <Box size={44} className="mx-auto mb-4 text-gray-400" />
          <p className="text-base font-semibold text-gray-800">No materials in inventory</p>
          <p className="mt-1 text-sm text-gray-500">
            Add the first material record to begin inventory tracking.
          </p>
          <Link
            href="/materials/new"
            className="mt-6 inline-flex h-10 items-center rounded-lg bg-blue-700 px-5 text-sm font-semibold text-white transition hover:bg-blue-800"
          >
            Add First Material
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
          <table className="w-full min-w-[1040px]">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">Item</th>
                <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">Category</th>
                <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">Received</th>
                <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">Used</th>
                <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">Remaining</th>
                <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">Status</th>
                <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">Received From</th>
                <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">Storage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {materials.map((material) => (
                <tr key={material.id} className="transition hover:bg-blue-50/40">
                  <td className="px-5 py-4 text-sm font-semibold text-gray-900">{material.itemName}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{material.category}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{material.quantityReceived}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{material.quantityUsed}</td>
                  <td className="px-5 py-4 text-sm font-medium text-gray-800">{material.quantityRemaining}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${
                      material.stockStatus === 'In Stock' ? 'text-green-700 bg-green-50 ring-green-200' :
                      material.stockStatus === 'Low Stock' ? 'text-yellow-700 bg-yellow-50 ring-yellow-200' :
                      'text-red-700 bg-red-50 ring-red-200'
                    }`}>
                      {material.stockStatus}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">{material.receivedFrom || '-'}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{material.storageLocation || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </div>
  );
}
