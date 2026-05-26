import AnalyticsChart from "@/src/components/AnalyticsChart";
import Link from "next/link";

// --- MOCK DATA (Replace with your actual database queries) ---
const stats = [
  { name: "Total Enrollments", value: "1,248", change: "+12%", trend: "up" },
  { name: "Active Students", value: "842", change: "+5.4%", trend: "up" },
  { name: "Completion Rate", value: "78.3%", change: "-2.1%", trend: "down" },
  { name: "Monthly Earnings", value: "$4,250", change: "+18.2%", trend: "up" },
];

const recentEnrollments = [
  {
    id: "1",
    student: "Sarah Jenkins",
    course: "Advanced React Patterns",
    date: "Today, 09:24 AM",
    status: "Active",
  },
  {
    id: "2",
    student: "Marcus Johnson",
    course: "System Design Interview",
    date: "Yesterday, 14:30 PM",
    status: "Active",
  },
  {
    id: "3",
    student: "Elena Rodriguez",
    course: "Full-Stack Next.js",
    date: "Oct 24, 11:15 AM",
    status: "Completed",
  },
  {
    id: "4",
    student: "David Chen",
    course: "Advanced React Patterns",
    date: "Oct 23, 16:45 PM",
    status: "Active",
  },
];
// -------------------------------------------------------------

export default function DashboardOverview() {
  return (
    <div className="space-y-8">
      {/* Page Header */}


      {/* Top KPI Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="overflow-hidden rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-800"
          >
            <div className="flex items-center justify-between">
              <p className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                {stat.name}
              </p>
              <span
                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                  stat.trend === "up"
                    ? "bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-900/30 dark:text-red-400"
                }`}
              >
                {stat.change}
              </span>
            </div>
            <div className="mt-4 flex items-baseline text-3xl font-bold text-gray-900 dark:text-white">
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid (Charts & Activity) */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Chart Section (Spans 2 columns) */}
        <div className="lg:col-span-2 flex flex-col rounded-xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-800">
          <div className="border-b border-gray-100 px-6 py-5 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              Revenue & Enrollments
            </h2>
            <select className="text-sm bg-gray-50 border-none rounded-md text-gray-600 focus:ring-0 dark:bg-gray-700 dark:text-gray-300">
              <option>Last 30 Days</option>
              <option>This Year</option>
              <option>All Time</option>
            </select>
          </div>
          <div className="w-full h-full min-h-[300px]">
            {" "}
            {/* The chart will now dynamically fill 100% width and height of this container */}
            <AnalyticsChart />
          </div>
        </div>

        {/* Quick Actions / Up Next (Spans 1 column) */}
        <div className="flex flex-col rounded-xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-800">
          <div className="border-b border-gray-100 px-6 py-5 dark:border-gray-700">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              Mentor Actions
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <Link
              href="/mentor/dashboard/certificates/create"
              className="group flex items-center justify-between rounded-lg border border-gray-200 p-4 transition-all hover:border-blue-500 hover:shadow-sm dark:border-gray-700 dark:hover:border-blue-500"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    Issue Certificate
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Reward your students
                  </p>
                </div>
              </div>
              <svg
                className="h-5 w-5 text-gray-400 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>

            <Link
              href="/mentor/dashboard/settings"
              className="group flex items-center justify-between rounded-lg border border-gray-200 p-4 transition-all hover:border-indigo-500 hover:shadow-sm dark:border-gray-700 dark:hover:border-indigo-500"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    Update Services
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Manage your offerings
                  </p>
                </div>
              </div>
              <svg
                className="h-5 w-5 text-gray-400 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Enrollments Table */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-800">
        <div className="border-b border-gray-100 px-6 py-5 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">
            Recent Enrollments
          </h2>
          <Link
            href="/mentor/dashboard/enrollments"
            className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            View all
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
                >
                  Student
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
                >
                  Course
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
                >
                  Enrolled Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
              {recentEnrollments.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 flex-shrink-0 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
                        {item.student.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.student}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-300">
                      {item.course}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {item.date}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        item.status === "Active"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                          : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      }`}
                    >
                      {item.status}
                    </span>
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
