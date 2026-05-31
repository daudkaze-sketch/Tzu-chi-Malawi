'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Plus } from 'lucide-react';
import { ExportOptions, type ExportColumn } from '@/components/ExportOptions';

interface Task {
  id: string;
  title: string;
  assignedTo: string;
  department: string;
  startDate: string;
  endDate: string;
  priority: string;
  status: string;
  notes?: string;
}

const taskColumns: ExportColumn<Task>[] = [
  { header: 'Task', accessor: 'title' },
  { header: 'Assigned To', accessor: 'assignedTo' },
  { header: 'Department', accessor: 'department' },
  { header: 'Start Date', accessor: (task) => formatDate(task.startDate) },
  { header: 'End Date', accessor: (task) => formatDate(task.endDate) },
  { header: 'Priority', accessor: 'priority' },
  { header: 'Status', accessor: 'status' },
  { header: 'Notes', accessor: (task) => task.notes || '-' },
];

function formatDate(value: string) {
  return new Date(value).toLocaleDateString();
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchTasks();
  }, [router]);

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      const data = await res.json();
      setTasks(data.tasks || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      High: 'text-red-700 bg-red-50 ring-red-200',
      Medium: 'text-yellow-700 bg-yellow-50 ring-yellow-200',
      Low: 'text-green-700 bg-green-50 ring-green-200',
    };
    return colors[priority] || 'text-gray-700 bg-gray-50 ring-gray-200';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'text-gray-700 bg-gray-50 ring-gray-200',
      'in-progress': 'text-blue-700 bg-blue-50 ring-blue-200',
      completed: 'text-green-700 bg-green-50 ring-green-200',
    };
    return colors[status] || colors.pending;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm font-medium text-gray-500">
        Loading tasks...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
            Scheduling
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-950">
            Tasks & Scheduling
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-600">
            Coordinate assignments, owners, timelines, and priority work across departments.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {tasks.length > 0 && (
            <ExportOptions
              columns={taskColumns}
              data={tasks}
              fileName="tasks-schedule"
              title="Tasks & Scheduling"
            />
          )}
          <Link
            href="/tasks/new"
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-blue-700 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800"
          >
            <Plus size={18} />
            <span>Add Task</span>
          </Link>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center shadow-sm">
          <Calendar size={44} className="mx-auto mb-4 text-gray-400" />
          <p className="text-base font-semibold text-gray-800">No tasks scheduled yet</p>
          <p className="mt-1 text-sm text-gray-500">
            Create the first task to start coordinating work.
          </p>
          <Link
            href="/tasks/new"
            className="mt-6 inline-flex h-10 items-center rounded-lg bg-blue-700 px-5 text-sm font-semibold text-white transition hover:bg-blue-800"
          >
            Create First Task
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px]">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">Task</th>
                  <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">Assigned To</th>
                  <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">Department</th>
                  <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">Start</th>
                  <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">End</th>
                  <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">Priority</th>
                  <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tasks.map((task) => (
                  <tr key={task.id} className="transition hover:bg-blue-50/40">
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-gray-900">{task.title}</p>
                      {task.notes && (
                        <p className="mt-1 line-clamp-1 text-xs text-gray-500">{task.notes}</p>
                      )}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">{task.assignedTo}</td>
                    <td className="px-5 py-4 text-sm text-gray-600">{task.department}</td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600">{formatDate(task.startDate)}</td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600">{formatDate(task.endDate)}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                    </td>
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
