'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Megaphone, Plus } from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  user: { name: string; email: string };
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch('/api/announcements');
      const data = await res.json();
      setAnnouncements(data.announcements || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Latest News & Updates</h1>
        {token && (
          <Link
            href="/announcements/new"
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            <Plus size={20} />
            <span>Post News</span>
          </Link>
        )}
      </div>

      {announcements.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <Megaphone size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">No announcements yet</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{announcement.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
                    <span>{announcement.user.name}</span>
                    <span>•</span>
                    <span>{new Date(announcement.date).toLocaleDateString()}</span>
                    <span>•</span>
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">{announcement.category}</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">{announcement.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
