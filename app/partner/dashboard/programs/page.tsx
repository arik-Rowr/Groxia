import Link from 'next/link';

export default function ProgramsDashboard() {
  return (
    <div className="max-w-7xl mx-auto p-6 lg:p-8">
      {/* Header Section */}


      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-500 mb-1">Total Active Programs</p>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white">4</h3>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-500 mb-1">Total Students</p>
          <h3 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">340</h3>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-500 mb-1">Internship Applicants</p>
          <h3 className="text-3xl font-bold text-blue-600 dark:text-blue-400">57</h3>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-500 mb-1">Overall Rating</p>
          <h3 className="text-3xl font-bold text-yellow-500">4.8</h3>
        </div>
      </div>

      {/* Navigation Launchpad */}
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Manage Your Content</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Courses Card */}
        <Link 
          href="/partner/dashboard/programs/courses" 
          className="group relative bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all hover:border-indigo-300 dark:hover:border-indigo-700"
        >
          <div className="absolute top-8 right-8 text-gray-300 group-hover:text-indigo-500 transition-colors">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
          <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center mb-6">
            <svg className="w-7 h-7 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Educational Courses</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm">
            Create, manage, and track progress for your video courses, curriculum, and student enrollments.
          </p>
        </Link>

        {/* Internships Card */}
        <Link 
          href="/partner/dashboard/programs/internship" 
          className="group relative bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all hover:border-blue-300 dark:hover:border-blue-700"
        >
          <div className="absolute top-8 right-8 text-gray-300 group-hover:text-blue-500 transition-colors">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
          <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-6">
            <svg className="w-7 h-7 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Internship Programs</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm">
            Post new internship opportunities, map out milestone timelines, and review applicant submissions.
          </p>
        </Link>
      </div>
    </div>
  );
}