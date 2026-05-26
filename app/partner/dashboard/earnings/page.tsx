import Link from 'next/link';

// --- MOCK DATA ---
const earningStats = [
  { name: 'Lifetime Earnings', value: '$24,500.00', change: '+12.5%', isPositive: true },
  { name: 'Available for Payout', value: '$1,250.00', change: 'Ready', isPositive: true },
  { name: 'Expected Next Payout', value: '$840.00', change: 'Processing', isPositive: false },
];

const transactions = [
  { id: 'txn_901', date: 'Oct 26, 2026', description: 'Payout to Bank Ending in 4242', amount: '-$1,500.00', status: 'Completed', type: 'withdrawal' },
  { id: 'txn_902', date: 'Oct 25, 2026', description: 'Advanced React Patterns - S. Jenkins', amount: '+$199.00', status: 'Cleared', type: 'earning' },
  { id: 'txn_903', date: 'Oct 24, 2026', description: 'System Design Interview - M. Johnson', amount: '+$299.00', status: 'Cleared', type: 'earning' },
  { id: 'txn_904', date: 'Oct 22, 2026', description: '1-on-1 Mentorship (1 hr) - E. Rodriguez', amount: '+$150.00', status: 'Pending', type: 'earning' },
];
// -----------------

export default function EarningsPage() {
  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors">
            <svg className="mr-2 h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export CSV
          </button>
          <button className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-500 transition-colors">
            Withdraw Funds
          </button>
        </div>
      </div>

      {/* Financial Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {earningStats.map((stat) => (
          <div key={stat.name} className="overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.name}</p>
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                stat.isPositive 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
              }`}>
                {stat.change}
              </span>
            </div>
            <p className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Chart Placeholder for Revenue Trends */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="border-b border-gray-200 px-6 py-5 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Revenue Trend</h2>
          <select className="text-sm bg-gray-50 border-gray-300 rounded-md text-gray-600 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
            <option>Last 30 Days</option>
            <option>This Quarter</option>
            <option>This Year</option>
          </select>
        </div>
        <div className="h-64 p-6 flex items-center justify-center bg-gray-50/50 dark:bg-gray-800/50">
           <div className="text-center text-gray-400 dark:text-gray-500">
              <svg className="mx-auto h-10 w-10 text-gray-300 dark:text-gray-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
              <p className="text-sm font-medium">Revenue Chart Integration</p>
            </div>
        </div>
      </div>

      {/* Transaction History Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="border-b border-gray-200 px-6 py-5 dark:border-gray-700">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Recent Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">Description</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">Amount</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400 ml-4">Status</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Receipt</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
              {transactions.map((txn) => (
                <tr key={txn.id} className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {txn.date}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className={`mr-3 rounded-full p-1 ${txn.type === 'earning' ? 'bg-green-100 text-green-600 dark:bg-green-900/30' : 'bg-gray-100 text-gray-600 dark:bg-gray-700'}`}>
                        {txn.type === 'earning' ? (
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        ) : (
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{txn.description}</span>
                    </div>
                  </td>
                  <td className={`whitespace-nowrap px-6 py-4 text-right text-sm font-semibold ${txn.type === 'earning' ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
                    {txn.amount}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      txn.status === 'Completed' || txn.status === 'Cleared' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {txn.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                      Receipt
                    </button>
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