import Link from 'next/link';
import { BarChart3, Users, FileText, CheckCircle, AlertCircle, Megaphone } from 'lucide-react';

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-900">Tzu Chi Malawi Office Dashboard</h1>
        <p className="mt-4 text-lg text-gray-600">
          Manage reports, attendance, tasks, inventory, and announcements in one place.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl border border-gray-200 bg-white p-10 shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Quick Start</h2>
          <p className="text-gray-600 mb-6">
            Use the sidebar to access core modules: dashboard, reports, attendance, tasks, materials, and announcements.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Link href="/dashboard" className="rounded-2xl bg-blue-600 px-5 py-4 text-white shadow-sm hover:bg-blue-700 transition">
              Go to Dashboard
            </Link>
            <Link href="/reports" className="rounded-2xl bg-gray-100 px-5 py-4 text-gray-900 hover:bg-gray-200 transition">
              View Reports
            </Link>
            <Link href="/attendance" className="rounded-2xl bg-gray-100 px-5 py-4 text-gray-900 hover:bg-gray-200 transition">
              View Attendance
            </Link>
            <Link href="/materials" className="rounded-2xl bg-gray-100 px-5 py-4 text-gray-900 hover:bg-gray-200 transition">
              Inventory
            </Link>
          </div>
        </section>

        <section className="rounded-3xl border border-gray-200 bg-white p-10 shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Highlights</h2>
          <div className="grid gap-4">
            <StatCard title="Reports" value="Keep track of daily summaries" icon={FileText} />
            <StatCard title="Attendance" value="Track staff attendance" icon={Users} />
            <StatCard title="Tasks" value="Manage assignments and progress" icon={CheckCircle} />
            <StatCard title="Inventory" value="Monitor materials and stock" icon={AlertCircle} />
          </div>
        </section>
      </div>

      <div className="mt-16 grid gap-6 lg:grid-cols-4">
        <FeatureCard title="Dashboard" href="/dashboard" icon={BarChart3} />
        <FeatureCard title="Announcements" href="/announcements" icon={Megaphone} />
        <FeatureCard title="Education" href="/departments/education" icon={Users} />
        <FeatureCard title="Charity" href="/departments/charity" icon={FileText} />
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon }: { title: string; value: string; icon: any }) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-slate-50 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-500">{title}</p>
          <p className="mt-3 text-lg font-bold text-gray-900">{value}</p>
        </div>
        <Icon size={24} className="text-blue-600" />
      </div>
    </div>
  );
}

function FeatureCard({ title, href, icon: Icon }: { title: string; href: string; icon: any }) {
  return (
    <Link href={href} className="rounded-3xl border border-gray-200 bg-white p-8 text-left shadow-sm hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <p className="mt-2 text-sm text-gray-600">Open module</p>
        </div>
        <Icon size={24} className="text-blue-600" />
      </div>
    </Link>
  );
}
