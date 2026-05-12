'use client';

import Link from 'next/link';
import { ArrowLeft, Home, Truck, Users, Heart, MapPin, FileText, Activity } from 'lucide-react';

export default function CharityDepartmentPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link
        href="/dashboard"
        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-6"
      >
        <ArrowLeft size={20} />
        <span>Back to Dashboard</span>
      </Link>

      <h1 className="text-3xl font-bold text-gray-800 mb-8">Charity Department</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DepartmentModule
          title="Home Visits"
          description="Conduct and record home visits with detailed assessments and follow-ups"
          icon={Home}
          href="/departments/charity/home-visits"
          color="bg-blue-100 text-blue-600"
        />
        <DepartmentModule
          title="Distribution Activities"
          description="Manage relief distribution with location tracking and beneficiary details"
          icon={Truck}
          href="/departments/charity/distributions"
          color="bg-green-100 text-green-600"
        />
        <DepartmentModule
          title="Community Activities"
          description="Organize and track community service and charity events"
          icon={Users}
          href="/departments/charity/community-activities"
          color="bg-purple-100 text-purple-600"
        />
        <DepartmentModule
          title="Beneficiary Management"
          description="Register and manage beneficiary information and support history"
          icon={Heart}
          href="/departments/charity/beneficiary-management"
          color="bg-red-100 text-red-600"
        />
        <DepartmentModule
          title="Survey & Assessment"
          description="Conduct area surveys and disaster assessments with comprehensive questions"
          icon={MapPin}
          href="/departments/charity/survey"
          color="bg-orange-100 text-orange-600"
        />
        <DepartmentModule
          title="Activity Reports"
          description="Generate reports on all charity activities and impact"
          icon={FileText}
          href="/departments/charity/reports"
          color="bg-teal-100 text-teal-600"
        />
      </div>
    </div>
  );
}

function DepartmentModule({
  title,
  description,
  icon: Icon,
  href,
  color,
}: {
  title: string;
  description: string;
  icon: any;
  href: string;
  color: string;
}) {
  return (
    <Link
      href={href}
      className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border border-gray-200"
    >
      <div className="flex items-start space-x-4">
        <div className={`${color} p-3 rounded-lg`}>
          <Icon size={24} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
      </div>
    </Link>
  );
}