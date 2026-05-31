'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BarChart3, Users, FileText, CheckCircle, AlertCircle, type LucideIcon } from 'lucide-react';

import VillagesManagement from '@/components/VillagesManagement';

interface Stats {
  reportsToday: number;
  attendanceToday: number;
  tasksInProgress: number;
  lowStockItems: number;
}

interface ReportSummary {
  date?: string;
}

interface TaskSummary {
  status?: string;
}

interface MaterialSummary {
  quantityRemaining?: number;
  remainingStock?: number;
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
        reportsToday: reports.reports?.filter((report: ReportSummary) => report.date?.startsWith(today)).length || 0,
        attendanceToday: attendance.attendances?.length || 0,
        tasksInProgress: tasks.tasks?.filter((task: TaskSummary) => task.status === 'in-progress').length || 0,
        lowStockItems: materials.materials?.filter((material: MaterialSummary) => {
          const remaining = material.quantityRemaining ?? material.remainingStock ?? 0;
          return remaining < 5;
        }).length || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { name: 'Add Report', href: '/reports/new', color: 'border-blue-100 text-blue-700 hover:bg-blue-50', icon: FileText },
    { name: 'Mark Attendance', href: '/attendance/new', color: 'border-green-100 text-green-700 hover:bg-green-50', icon: Users },
    { name: 'Add Task', href: '/tasks/new', color: 'border-violet-100 text-violet-700 hover:bg-violet-50', icon: CheckCircle },
    { name: 'Update Inventory', href: '/materials/new', color: 'border-orange-100 text-orange-700 hover:bg-orange-50', icon: AlertCircle },
  ];

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-sm font-medium text-gray-500">Loading dashboard...</div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
          Executive Overview
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-950">
          Welcome to Tzu Chi Malawi
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Reports Today"
          value={stats.reportsToday}
          icon={FileText}
          color="text-blue-700 bg-blue-50 border-blue-100"
        />
        <StatCard
          title="Attendance"
          value={stats.attendanceToday}
          icon={Users}
          color="text-green-700 bg-green-50 border-green-100"
        />
        <StatCard
          title="Tasks In Progress"
          value={stats.tasksInProgress}
          icon={CheckCircle}
          color="text-violet-700 bg-violet-50 border-violet-100"
        />
        <StatCard
          title="Low Stock Items"
          value={stats.lowStockItems}
          icon={AlertCircle}
          color="text-orange-700 bg-orange-50 border-orange-100"
        />
      </div>

      {/* Quick Actions */}
      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-950">Quick Actions</h2>
            <p className="mt-1 text-sm text-gray-500">Start common office workflows in one click.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.name}
                href={action.href}
                className={`${action.color} flex items-center justify-center gap-2 rounded-lg border bg-white px-5 py-4 text-sm font-bold shadow-sm transition`}
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
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
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
  icon: LucideIcon;
  color: string;
}) {
  return (
    <div className={`rounded-xl border bg-white p-5 shadow-sm ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold opacity-80">{title}</p>
          <p className="mt-2 text-3xl font-bold">{value}</p>
        </div>
        <div className="rounded-lg bg-white/70 p-3 shadow-sm">
          <Icon size={26} className="opacity-80" />
        </div>
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
  icon: LucideIcon;
}) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
    >
      <div className="flex items-center space-x-4">
        <div className="rounded-lg bg-blue-50 p-3 text-blue-700 ring-1 ring-blue-100">
          <Icon size={24} />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">{title} Department</h3>
          <p className="mt-1 text-sm text-gray-500">Manage and track activities</p>
        </div>
      </div>
    </Link>
  );
}
