'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BarChart3, Users, FileText, CheckCircle, AlertCircle, Plus } from 'lucide-react';

import VillagesManagement from '@/components/VillagesManagement';

interface Stats {
  reportsToday: number;
  attendanceToday: number;
  tasksInProgress: number;
  lowStockItems: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    reportsToday: 0,
    attendanceToday: 0,
    tasksInProgress: 0,
    lowStockItems: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch reports
      const reportsRes = await fetch('/api/reports');
      const reports = await reportsRes.json();

      // Fetch attendance
      const attendanceRes = await fetch('/api/attendance');
      const attendance = await attendanceRes.json();

      // Fetch tasks
      const tasksRes = await fetch('/api/tasks');
      const tasks = await tasksRes.json();

      // Fetch materials
      const materialsRes = await fetch('/api/materials');
      const materials = await materialsRes.json();

      const today = new Date().toISOString().split('T')[0];

      setStats({
        reportsToday: reports.reports?.filter((r: any) => r.date?.startsWith(today)).length || 0,
        attendanceToday: attendance.attendances?.length || 0,
        tasksInProgress: tasks.tasks?.filter((t: any) => t.status === 'in-progress').length || 0,
        lowStockItems: materials.materials?.filter((m: any) => m.remainingStock && m.remainingStock < 5).length || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { name: 'Add Report', href: '/reports/new', color: 'bg-blue-500 hover:bg-blue-600', icon: FileText },
    { name: 'Mark Attendance', href: '/attendance/new', color: 'bg-green-500 hover:bg-green-600', icon: Users },
    { name: 'Add Task', href: '/tasks/new', color: 'bg-purple-500 hover:bg-purple-600', icon: CheckCircle },
    { name: 'Update Inventory', href: '/materials/new', color: 'bg-orange-500 hover:bg-orange-600', icon: AlertCircle },
  ];

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">
          Welcome to Tzu Chi Malawi
        </h1>
        <p className="text-gray-600 mt-2">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Reports Today"
          value={stats.reportsToday}
          icon={FileText}
          color="bg-blue-100 text-blue-600"
        />
        <StatCard
          title="Attendance"
          value={stats.attendanceToday}
          icon={Users}
          color="bg-green-100 text-green-600"
        />
        <StatCard
          title="Tasks In Progress"
          value={stats.tasksInProgress}
          icon={CheckCircle}
          color="bg-purple-100 text-purple-600"
        />
        <StatCard
          title="Low Stock Items"
          value={stats.lowStockItems}
          icon={AlertCircle}
          color="bg-orange-100 text-orange-600"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.name}
                href={action.href}
                className={`${action.color} text-white font-bold py-4 px-6 rounded-lg flex items-center justify-center space-x-2 transition duration-200`}
              >
                <Icon size={20} />
                <span>{action.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Villages Management */}
      <div className="mb-8">
        <VillagesManagement />
      </div>

      {/* Department Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DepartmentCard
          title="Education"
          href="/departments/education"
          icon={FileText}
        />
        <DepartmentCard
          title="Agriculture"
          href="/departments/agriculture"
          icon={BarChart3}
        />
        <DepartmentCard
          title="Charity"
          href="/departments/charity"
          icon={Users}
        />
        <DepartmentCard
          title="Media"
          href="/departments/media"
          icon={FileText}
        />
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: number;
  icon: any;
  color: string;
}) {
  return (
    <div className={`${color} rounded-lg shadow-md p-6`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-75">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <Icon size={32} className="opacity-50" />
      </div>
    </div>
  );
}

function DepartmentCard({
  title,
  href,
  icon: Icon,
}: {
  title: string;
  href: string;
  icon: any;
}) {
  return (
    <Link
      href={href}
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-200"
    >
      <div className="flex items-center space-x-4">
        <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
          <Icon size={24} />
        </div>
        <div>
          <h3 className="font-bold text-gray-800">{title} Department</h3>
          <p className="text-sm text-gray-600 mt-1">Manage & track activities</p>
        </div>
      </div>
    </Link>
  );
}
