import Link from 'next/link';

// --- MOCK DATA FETCHER ---
// In production, you would use: const student = await db.enrollment.findUnique({ where: { id: params.id }})
async function getEnrollmentDetails(id: string) {
  return {
    id,
    student: 'Sarah Jenkins',
    email: 'sarah.j@example.com',
    course: 'Advanced React Patterns',
    status: 'Active',
    progress: 65,
    startDate: 'Oct 25, 2026',
    estimatedCompletion: 'Nov 15, 2026',
    milestones: [
      { title: 'Module 1: React Hooks Deep Dive', status: 'completed', date: 'Oct 27, 2026' },
      { title: 'Module 2: Custom Hooks & Context', status: 'completed', date: 'Nov 02, 2026' },
      { title: 'Module 3: Performance Optimization', status: 'in-progress', date: 'Current' },
      { title: 'Module 4: Server Components', status: 'locked', date: 'Pending' },
    ]
  };
}
// -------------------------

export default async function EnrollmentDetail({ params }: { params: { id: string } }) {
  const data = await getEnrollmentDetails(params.id);

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <nav className="flex" aria-label="Breadcrumb">
        <Link 
          href="/partner/dashboard/enrollments" 
          className="text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center transition-colors"
        >
          <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Enrollments
        </Link>
      </nav>

      {/* Student Profile Header Header */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="px-6 py-8 sm:flex sm:items-center sm:justify-between">
          <div className="sm:flex sm:space-x-5">
            <div className="flex-shrink-0">
              <div className="mx-auto h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 border-4 border-white dark:border-gray-800 shadow-sm">
                {data.student.charAt(0)}
              </div>
            </div>
            <div className="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
              <p className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">{data.student}</p>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{data.email}</p>
              <div className="mt-2 flex items-center justify-center sm:justify-start gap-2">
                <span className="inline-flex rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                  {data.course}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-5 flex justify-center sm:mt-0 gap-3">
            <button className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors">
              Message Student
            </button>
            <button 
              disabled={data.progress !== 100}
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Issue Certificate
            </button>
          </div>
        </div>
        
        {/* Quick Stats Banner */}
        <div className="grid grid-cols-1 divide-y divide-gray-200 border-t border-gray-200 bg-gray-50 dark:divide-gray-700 dark:border-gray-700 dark:bg-gray-800/50 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <div className="px-6 py-5 text-center text-sm sm:text-left">
            <span className="block font-medium text-gray-500 dark:text-gray-400">Start Date</span>
            <span className="mt-1 block font-semibold text-gray-900 dark:text-white">{data.startDate}</span>
          </div>
          <div className="px-6 py-5 text-center text-sm sm:text-left">
            <span className="block font-medium text-gray-500 dark:text-gray-400">Est. Completion</span>
            <span className="mt-1 block font-semibold text-gray-900 dark:text-white">{data.estimatedCompletion}</span>
          </div>
          <div className="px-6 py-5 text-center text-sm sm:text-left">
            <span className="block font-medium text-gray-500 dark:text-gray-400">Current Status</span>
            <span className="mt-1 block font-semibold text-green-600 dark:text-green-400">{data.status}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Progress Tracker (Left Column) */}
        <div className="lg:col-span-2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="border-b border-gray-200 px-6 py-5 dark:border-gray-700">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">Curriculum Progress</h3>
          </div>
          <div className="px-6 py-6">
            {/* Main Progress Bar */}
            <div className="mb-8 flex items-center justify-between">
              <div className="w-full mr-4">
                <div className="flex justify-between mb-2 text-sm font-medium">
                  <span className="text-gray-700 dark:text-gray-300">Overall Completion</span>
                  <span className="text-blue-600 dark:text-blue-400">{data.progress}%</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <div 
                    className="h-2.5 rounded-full bg-blue-600 transition-all duration-1000 ease-out" 
                    style={{ width: `${data.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Timeline Milestones */}
            <div className="flow-root">
              <ul role="list" className="-mb-8">
                {data.milestones.map((milestone, milestoneIdx) => (
                  <li key={milestone.title}>
                    <div className="relative pb-8">
                      {milestoneIdx !== data.milestones.length - 1 ? (
                        <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700" aria-hidden="true" />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white dark:ring-gray-800 ${
                            milestone.status === 'completed' ? 'bg-green-500' :
                            milestone.status === 'in-progress' ? 'bg-blue-500 animate-pulse' :
                            'bg-gray-300 dark:bg-gray-600'
                          }`}>
                            {milestone.status === 'completed' ? (
                              <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                            ) : milestone.status === 'in-progress' ? (
                              <div className="h-2.5 w-2.5 rounded-full bg-white" />
                            ) : null}
                          </span>
                        </div>
                        <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                          <div>
                            <p className={`text-sm font-medium ${milestone.status === 'locked' ? 'text-gray-500 dark:text-gray-500' : 'text-gray-900 dark:text-gray-200'}`}>
                              {milestone.title}
                            </p>
                          </div>
                          <div className="whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-400">
                            {milestone.date}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Notes/CRM Sidebar (Right Column) */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
           <div className="border-b border-gray-200 px-6 py-5 dark:border-gray-700">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">Mentor Notes</h3>
          </div>
          <div className="p-6">
            <textarea 
              rows={6}
              placeholder="Add private notes about Sarah's progress, struggles, or performance..."
              className="w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 resize-none"
            />
            <button className="mt-3 w-full rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors">
              Save Note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}