'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Plus } from 'lucide-react';

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
      'High': 'text-red-600 bg-red-100',
      'Medium': 'text-yellow-600 bg-yellow-100',
      'Low': 'text-green-600 bg-green-100',
    };
    return colors[priority] || 'text-gray-600 bg-gray-100';
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Tasks & Scheduling</h1>
        <Link
          href="/tasks/new"
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition"
        >
          <Plus size={20} />
          <span>Add Task</span>
        </Link>
      </div>

      {tasks.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 mb-4">No tasks scheduled yet</p>
          <Link
            href="/tasks/new"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg"
          >
            Create First Task
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {tasks.map((task) => (
            <div key={task.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{task.title}</h3>
                  <p className="text-sm text-gray-600">
                    {task.department} • Assigned to: {task.assignedTo}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                <span>Start: {new Date(task.startDate).toLocaleDateString()}</span>
                <span className="mx-2">•</span>
                <span>End: {new Date(task.endDate).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
