import React from 'react';
import Link from 'next/link';

interface Internship {
  id: string;
  title: string;
  type: string;
  duration: string;
  applicants: number;
  status: 'Active' | 'Draft' | 'Closed';
}

const mockInternships: Internship[] = [
  {
    id: 'int-001',
    title: 'Frontend React Developer',
    type: 'Remote',
    duration: '3 Months',
    applicants: 42,
    status: 'Active',
  },
  {
    id: 'int-002',
    title: 'UI/UX Design Intern',
    type: 'Hybrid',
    duration: '6 Months',
    applicants: 15,
    status: 'Draft',
  },
];

export default function InternshipProgramsPage() {
  return (
    <div className="max-w-7xl mx-auto p-6 lg:p-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Internship Programs</h1>
          <p className="text-gray-500 mt-1">Manage your internship listings and track applicants.</p>
        </div>
        <Link 
          href="/programs/internship/create" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
        >
          + Create New Internship
        </Link>
      </header>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
            <thead className="bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Role Title</th>
                <th className="px-6 py-4">Type & Duration</th>
                <th className="px-6 py-4">Applicants</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {mockInternships.map((internship) => (
                <tr key={internship.id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {internship.title}
                  </td>
                  <td className="px-6 py-4">
                    <span className="block">{internship.type}</span>
                    <span className="text-xs text-gray-400">{internship.duration}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 py-1 px-3 rounded-full text-xs font-semibold">
                      {internship.applicants} Applied
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      internship.status === 'Active' ? 'bg-green-100 text-green-800' : 
                      internship.status === 'Draft' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {internship.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">Edit</button>
                    <button className="text-gray-500 hover:text-gray-700 font-medium text-sm">Manage</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}