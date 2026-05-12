'use client';

import Link from 'next/link';
import { ArrowLeft, Briefcase, Users, FileText, Award } from 'lucide-react';

export default function EducationDepartmentPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link
        href="/dashboard"
        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-6"
      >
        <ArrowLeft size={20} />
        <span>Back to Dashboard</span>
      </Link>

      <h1 className="text-3xl font-bold text-gray-800 mb-8">Education Department</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DepartmentModule
          title="Teaching Activities"
          description="Track Dharma teachings, Jing Si Aphorism training, and office programs"
          icon={FileText}
          href="/departments/education/teaching-activities"
        />
        <DepartmentModule
          title="Scholarship Students"
          description="Manage and monitor scholarship student records and progress"
          icon={Users}
          href="/departments/education/scholarship-students"
        />
        <DepartmentModule
          title="Pre-School Monitoring"
          description="Evaluate pre-school student performance"
          icon={Award}
          href="/departments/education/pre-school-monitoring"
        />
        <DepartmentModule
          title="Programs & Training"
          description="Organize office training programs"
          icon={Briefcase}
          href="/departments/education/office-training"
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
}: {
  title: string;
  description: string;
  icon: any;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
    >
      <div className="flex items-start space-x-4">
        <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
          <Icon size={24} />
        </div>
        <div>
          <h3 className="font-bold text-lg text-gray-800">{title}</h3>
          <p className="text-gray-600 text-sm mt-2">{description}</p>
        </div>
      </div>
    </Link>
  );
}
